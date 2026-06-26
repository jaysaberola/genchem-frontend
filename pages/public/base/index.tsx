import React, { useEffect, useState } from "react";
import { getPublicPageBySlug, PublicAlbum } from "@/services/publicPageService";
import { getPublicArticles } from "@/services/articleService";
import { getProducts } from "@/services/productService";
import LandingPageLayout from "@/components/Layout/GuestLayout";

export const BANNER_TITLE = "GENCHEM PH";

export async function getServerSideProps() {
    try {
        // fetch page config and latest news concurrently
        const [pageRes, articlesRes] = await Promise.all([
            getPublicPageBySlug("home"),
            getPublicArticles({ per_page: 3 }),
        ]);

        // fetch latest products (limit 4)
        let products: any[] = [];
        try {
            // attempt simple call first; avoid order_by/sort in case backend doesn't support
            const prodRes = await getProducts({ per_page: 4 });
            const data = prodRes?.data ?? prodRes;
            if (Array.isArray(data)) {
                products = data;
            } else {
                products = data?.data ?? data?.items ?? data?.rows ?? [];
            }
        } catch (e) {
            // ignore; leave products empty for now
        }
        // if we didn't get any results, try a manual fallback similar to products page logic
        if (!products.length) {
            try {
                const eps = ["/public-products", "/public/products", "/products", "/api/products"];
                const { axiosInstance } = await import("@/services/axios");
                const extractArray = (payload: any) => {
                    if (!payload) return [];
                    let data: any = payload?.data ?? payload;
                    if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
                        data = (data as any).data;
                        if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
                            data = (data as any).data;
                        }
                    }
                    if (Array.isArray(data)) return data;
                    const candidates = [
                        (data as any)?.items,
                        (data as any)?.rows,
                        (data as any)?.results,
                        (data as any)?.result,
                        (data as any)?.products,
                        (data as any)?.categories,
                        (data as any)?.product_categories,
                        (data as any)?.productCategories,
                        (data as any)?.productCategory,
                    ];
                    for (const c of candidates) {
                        if (Array.isArray(c)) return c;
                        if (c && typeof c === "object" && Array.isArray((c as any).data)) return (c as any).data;
                    }
                    return [];
                };

                for (const ep of eps) {
                    try {
                        const resp = await axiosInstance.get(ep, { params: { per_page: 4 }, headers: { "X-No-Loading": true } });
                        const arr = extractArray(resp.data);
                        if (arr && arr.length) {
                            products = arr.slice(0, 4);
                            break;
                        }
                    } catch {
                        // try next endpoint
                    }
                }
            } catch {
                // still empty
            }
        }

        // debug - inspect what we fetched; logs on server
        console.log("[SSR] landing page products count", products.length);
        return {
            props: {
                pageData: pageRes.data,
                news: articlesRes.data?.data ?? [],
                products,
            },
        };
    } catch (error) {
        console.error("Error fetching page data:", error);
        return { notFound: true };
    }
}

interface LandingPageLayoutProps {
  children: React.ReactNode;
  pageData?: {
    title?: string;
    album?: PublicAlbum | null;
  };
  layout?: {
    fullWidth?: boolean;
  };
  news?: any[];
  products?: any[]; // latest products to showcase
}

type Slide = {
    image: string;
    title: string;
    desc: string;
};

function Slider({ slides }: { slides: Slide[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 4000);
        return () => clearInterval(id);
    }, [slides.length]);

    const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length);
    const next = () => setIndex(i => (i + 1) % slides.length);

    return (
        <div className="slider-root">
            <div className="slide d-flex align-items-center">
                <div className="slide-image" style={{ width: '60%' }}>
                    <img src={slides[index].image} alt={slides[index].title} className="img-fluid" />
                </div>
                <div className="slide-info p-4" style={{ width: '40%' }}>
                    <h3 className="fs-3 fw-bold">{slides[index].title}</h3>
                    <p className="fs-6 text-secondary">{slides[index].desc}</p>
                    <div>
                        <a href="/public/news" className="btn btn-danger mt-4 w-20">Learn More</a>
                    </div>
                </div>
            </div>

            <button aria-label="Previous" onClick={prev} className="nav-button prev">‹</button>
            <button aria-label="Next" onClick={next} className="nav-button next">›</button>

            <div className="indicators mt-3 text-center">
                {slides.map((_, i) => (
                    <span key={i} onClick={() => setIndex(i)} className={`indicator ${i === index ? 'active' : ''}`}></span>
                ))}
            </div>

            <style jsx>{`
                .slider-root { position: relative; max-width: 1280px; margin: 0 auto; }
                .slide { gap: 20px; }
                .slide-image img { width: 100%; height: 360px; object-fit: cover; border-radius: 8px; }
                .slide-info { display: flex; flex-direction: column; justify-content: center; }
                .nav-button { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); color: #fff; border: none; padding: 8px 12px; font-size: 20px; border-radius: 6px; cursor: pointer;  padding-top: 4px; }
                .nav-button.prev { left: 8px; }
                .nav-button.next { right: 8px; }
                .indicators { display:flex; justify-content:center; gap:8px; }
                .indicator { width:10px; height:10px; border-radius:50%; background:#ddd; display:inline-block; cursor:pointer; }
                .indicator.active { background:#ff7b00; }
                @media(max-width: 768px) {
                    .slide { flex-direction: column; }
                    .slide-image img { height: 220px; }
                    .slide-image, .slide-info { width: 100% !important; }
                }
            `}</style>
        </div>
    );
}

export default function Base({ pageData, news, products = [] }: LandingPageLayoutProps) {
        const [clientProducts, setClientProducts] = useState<any[]>(products);

        // if SSR didn't supply any, try fetching on the client similar to the public products page
        useEffect(() => {
            if (clientProducts && clientProducts.length) return;
            let cancelled = false;
            const extractArray = (payload: any): any[] => {
                if (!payload) return [];
                let data: any = payload?.data ?? payload;
                if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
                    data = (data as any).data;
                    if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
                        data = (data as any).data;
                    }
                }
                if (Array.isArray(data)) return data;
                const candidates = [
                    (data as any)?.items,
                    (data as any)?.rows,
                    (data as any)?.results,
                    (data as any)?.result,
                    (data as any)?.products,
                    (data as any)?.categories,
                    (data as any)?.product_categories,
                    (data as any)?.productCategories,
                    (data as any)?.productCategory,
                ];
                for (const c of candidates) {
                    if (Array.isArray(c)) return c;
                    if (c && typeof c === "object" && Array.isArray((c as any).data)) return (c as any).data;
                }
                return [];
            };

            const fetchClient = async () => {
                try {
                    const { axiosInstance } = await import("@/services/axios");
                    const eps = ["/public-products", "/public/products", "/products", "/api/products"];
                    for (const ep of eps) {
                        try {
                            const resp = await axiosInstance.get(ep, { params: { per_page: 4 }, headers: { "X-No-Loading": true } });
                            const arr = extractArray(resp.data);
                            if (arr && arr.length) {
                                if (!cancelled) setClientProducts(arr.slice(0, 4));
                                break;
                            }
                        } catch {
                            // continue
                        }
                    }
                } catch {
                    // ignore
                }
            };
            fetchClient();
            return () => { cancelled = true; };
        }, [clientProducts]);

        const descriptors = ["Modern", "Real Estate", "Business"];
        const [descIndex, setDescIndex] = useState(0);

        useEffect(() => {
                const id = setInterval(() => {
                        setDescIndex(i => (i + 1) % descriptors.length);
                }, 2500);
                return () => clearInterval(id);
        }, []);

    return (

    <div>

        {/* <Header />
        
        <Banner
            title={BANNER_TITLE || pageData?.title}
            album={pageData?.album}
        /> */}
        
        <div className="w-100 base-content">

            <div className="container py-5 text-center cutter-section">

                <div className="heading-block text-center border-0" data-heading="P">
                    <h2 className="fs-1 fw-bold">Our Products</h2>
                </div>

                <div className="w-100 cutter-title">
                        <p className="fs-5 fw-light text-secondary py-3 w-50 text-center mx-auto">
                        GENCHEM PH delivers durable, high-quality PVC solutions engineered for strength, style, and long-lasting performance.
                        Designed for <span id="description-animate" aria-live="polite" style={{color: '#ff7b00'}}>{descriptors[descIndex]}</span> construction and everyday reliability.
                    </p>
                </div>

                <div className="w-100 products-container-lines">
                    <div className="d-flex flex-column flex-md-row flex-md-wrap flex-lg-nowrap gap-4 justify-content-center">
                        {clientProducts.map((p) => {
                            const img = p.image_url || p.image || "/images/logo.png";
                            const href = `/public/product/${p.slug ?? p.id}`;
                            return (
                                <div key={p.id ?? p.slug} className="col-6 col-md-3 mx-auto">
                                    <div className="card rounded-2 shadow-sm animate-hov">
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${img}`} className="border-bottom" alt={p.name || p.title || "Product"} style={{ minHeight: "150px", maxHeight: "150px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px", objectFit: "cover", width: "100%" }} />
                                        <div className="py-4 px-3 text-start">
                                            <h3 className="fs-6 fw-bold" style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {p.name || p.title || p.slug}
                                            </h3>
                                            <p className="fs-6 fw-light text-secondary" style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {(p.description ?? p.teaser ?? p.summary ?? "").toString()}
                                            </p>
                                            <a href={href} className="fw-bold text-orange text-decoration-none">Read More</a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {clientProducts.length === 0 && (
                            <p className="txt14">No featured products available.</p>
                        )}
                    </div>
                    <a href="/public/products" className="btn btn-danger text-white fw-light fs-6 mt-5">See More..</a>
                </div>
                
            </div>

            <div className="w-100 border-top border-bottom mx-auto cutter-section">
                    
                <div className="d-flex flex-column flex-md-row about-us-base-section" style={{maxHeight: "600px", overflowY: "hidden"}}>
                    <div className="col-12 col-md-6">
                        <img src="/images/highlights/work1.jpg" alt="About Us" style={{maxWidth: "stretch", minHeight: "600px"}} />
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="col-9 p-4 mx-auto">
                            <div className="heading-block-start text-center border-0 my-5" data-heading="A">
                                <h2 className="fs-1 fw-bold text-start">About Us</h2>
                            </div>
                            <p className="fs-6 fw-light text-secondary text-start" >
                                <strong>GENCHEM PH</strong> was founded in 1962, producing PVC pipes, hoses and other items.
                            </p>
                            <p className="fs-6 fw-light text-secondary text-start" >
                                GENCHEM PH is a leading supplier of high-quality PVC products, committed to delivering durable and innovative solutions for modern construction needs. With a focus on quality, reliability, and customer satisfaction, we provide a wide range of PVC products designed to meet the demands of both residential and commercial projects. Our team of experts works closely with clients to ensure that our products not only meet but exceed industry standards, making us a trusted partner in the construction industry.
                            </p>
                            <a href="/public/about" className="btn btn-danger mt-4">
                                Read More
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="w-100 container cutter-section">
                <div className="heading-block text-center border-0 cutter-title" data-heading="P">
                    <h2 className="fs-1 fw-bold">Our Projects</h2>
                    <small className="fs-5 fw-light text-secondary">
                        Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                        From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                    </small>
                </div>

                <div className="d-flex flex-column flex-md-row gap-4 justify-content-center">
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj5.jpg" alt="Project 1" className="img-fluid proj-image" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">El Jardin Del Presidente</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj2.jpg" alt="Project 1" className="img-fluid" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">RCBC Plaza</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj6.jpg" alt="Project 1" className="img-fluid" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">Robinson's Galleria Regency</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj4.jpg" alt="Project 1" className="img-fluid proj-image" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">Corinthian Hills</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="d-flex flex-column flex-md-row gap-4 justify-content-center mt-5">
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj7.jpg" alt="Project 1" className="img-fluid" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">Greenbelt 1 & 2 Redevelopment</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj8.jpg" alt="Project 1" className="img-fluid" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">Heritage Park</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj9.jpg" alt="Project 1" className="img-fluid" />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">Paseo Parkview</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-6 col-md-3 mx-auto">
                        <a href="/public/project" className="text-decoration-none">
                            <div className="card shadow animate-hov">
                                <div className="card-body p-0">
                                    <div className="image-responsive">
                                        <img src="/images/projects/proj10.jpg" alt="Project 1" className="img-fluid " />
                                    </div>
                                    <h5 className="fw-4 text-center my-4">Manila - Japanese School</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                
            </div>

            <div className="w-100 cutter-section">
                
                <div className="heading-block text-center border-0 mt-5 cutter-title" data-heading="W">
                    <h2 className="fs-1 fw-bold">What's New</h2>
                </div>

                <div className="work-slider mt-5">
                    {/* Simple responsive slider: 60% image, 40% info */}
                    {/** Slides data */}
                    {(() => {
                        const articles = news ?? [];

                        const slides: Slide[] = articles.length > 0
                            ? articles.map((a: any) => ({
                                image: a.thumbnail_url
                                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${a.thumbnail_url}`
                                    : (a.image_url ?? '/images/highlights/diamond_pvc.jpg'),
                                title: a.name || a.title || '',
                                desc: a.teaser || a.excerpt || '',
                            }))
                            : [
                                {
                                    image: '/images/highlights/diamond_pvc.jpg',
                                    title: 'Quality PVC Products',
                                    desc: 'Durable, attractive PVC solutions for modern builds.'
                                },
                                {
                                    image: '/images/highlights/armstrong_pvc.jpg',
                                    title: 'Precision Manufacturing',
                                    desc: 'Engineered for strength and consistent performance.'
                                },
                                {
                                    image: '/images/highlights/blue_pvc.jpg',
                                    title: 'Trusted by Professionals',
                                    desc: 'Proven in large-scale and residential projects.'
                                }
                              ];

                        return (
                            <Slider slides={slides} />
                        );
                    })()}
                </div>

            </div>

            <div className="w-100 my-5 py-5 cutter-section" style={{background: "linear-gradient(90deg, #FF0000, #FF4500, #FFA500);"}}>
                <h5 className="text-white text-center fs-2">We offer the best PVC solutions in the market. See our <b><a href="/public/products" className="text-white fw-bold fs-3">Product List</a></b></h5>
            </div>

        </div>

    </div>

  );
}

Base.Layout = LandingPageLayout;