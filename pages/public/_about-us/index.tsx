import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/_Header";
import HeaderBar from "@/components/Layout/HeaderBar";
import GlobalFooter from '@/components/Layout/GlobalFooter';
import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";

interface PublicPageViewProps {
  pageData: PublicPage;
}

export default function AboutUs() {
    return (
        
        <div>
            <div className="d-flex text-center flex-column align-items-center cutter-section">
                <div className="container">

                    <div className="heading-block text-center border-0 cutter-title" data-heading="A">
                        <h2 className="fs-1 fw-bold mb-4">About Us</h2>
                        <small className="fs-5 fw-light text-secondary">
                            Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                            From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                        </small>
                    </div>

                    <div className="image-container container">
                        <img src="/images/highlights/landing2.jpg" alt="" className="img-fluid rounded-3" />

                        <p className="fs-5 fw-light text-secondary my-4 text-start">
                            <b>GENCHEM PH is </b>our projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                            From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time. 
                            Our commitment to quality and innovation is evident in every project we undertake, ensuring that our customers receive the best possible solutions for their piping needs.
                            The success of our projects is a testament to our dedication to excellence and our ability to meet the unique requirements of each client, making us a trusted partner in the industry.
                        </p>
                    </div>

                </div>

                <div className="container cutter-section">
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                        <div className="col-12 col-md-4">
                            <div className="card shadow border-0 animate-hov py-4 px-4" data-delay="0.1s">
                                <h2 className="fs-5 fw-bold mb-3">Our Vision</h2>
                                <p className="text-start text-secondary">
                                    At <b>GENCHEM PH</b>, our vision is to become a leading and trusted provider of high-quality PVC piping solutions, known for durability, innovation, and excellence in service. 
                                    We aim to support residential, commercial, and industrial developments by delivering reliable products that meet the highest industry standards. 
                                    Through continuous improvement and customer-focused solutions, we strive to build long-term partnerships and contribute to stronger, more sustainable infrastructure in every community we serve.
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="card shadow border-0 animate-hov py-4 px-4 border-top" data-delay="0.1s">
                                <h2 className="fs-5 fw-bold mb-3">Our Mission</h2>
                                <p className="text-start text-secondary">
                                    At <b>GENCHEM PH</b>, our mission is to manufacture and supply high-quality, durable, and cost-effective PVC piping solutions that meet the evolving needs of residential, commercial, and industrial projects. 
                                    We are committed to delivering reliable products, excellent customer service, and consistent performance while upholding the highest standards of safety and integrity.
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="card shadow border-0 animate-hov py-4 px-4" data-delay="0.1s">
                                <h2 className="fs-5 fw-bold mb-3">Our Goals</h2>
                                <ul className="text-start text-secondary">
                                    <li>
                                        To ensure consistent product quality through strict quality control and industry compliance.
                                    </li>
                                    <li>
                                        To expand our distribution network and make GENCHEM PH products accessible nationwide.
                                    </li>
                                    <li>
                                        To continuously improve our manufacturing processes through innovation and modern technology.
                                    </li>
                                    <li>
                                        To build long-term partnerships with contractors, developers, and suppliers.
                                    </li>
                                    <li>
                                        To promote sustainable practices that support environmental responsibility.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-100 border-top border-bottom" style={{maxHeight: '700px', overflow: 'hidden'}}>
                    <div className="d-flex flex-column flex-md-row gap-4">
                        <div className="col-12 col-md-6 image-container">
                            <img src="/images/highlights/roofing3.jpg" alt="" className="img-fluid" />
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="container" style={{maxWidth: '780px'}}>
                                <div className="heading-block-start text-center border-0 my-5" data-heading="H">
                                    <h2 className="fs-1 fw-bold text-start">Our History</h2>
                                </div>
                                <p className="fs-5 fw-light text-secondary text-start pe-4" >
                                    <strong>GENCHEM PH</strong> was founded in 1962, producing PVC pipes, hoses and other items.
                                </p>
                                <p className="fs-5 fw-light text-secondary text-start pe-4" >
                                    GENCHEM PH is a leading supplier of high-quality PVC products, committed to delivering durable and innovative solutions for modern construction needs. With a focus on quality, reliability, and customer satisfaction, we provide a wide range of PVC products designed to meet the demands of both residential and commercial projects. Our team of experts works closely with clients to ensure that our products not only meet but exceed industry standards, making us a trusted partner in the construction industry.
                                </p>
                                <p className="fs-5 fw-light text-secondary text-start pe-4" >
                                    GENCHEM PH is a leading supplier of high-quality PVC products, committed to delivering durable and innovative solutions for modern construction needs. With a focus on quality, reliability, and customer satisfaction, we provide a wide range of PVC products designed to meet the demands of both residential and commercial projects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container cutter-section">
                    
                    <div className="heading-block text-center border-0 cutter-title" data-heading="C">
                            <h2 className="fs-1 fw-bold mb-4">Our Clients</h2>
                        <small className="fs-5 fw-light text-secondary">
                            Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                            From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                        </small>
                    </div>

                    <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/1.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/2.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/3.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/4.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/5.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/6.png" alt="" className="img-fluid rounded-3" />
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-0 mt-md-4 ">
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/7.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/8.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/9.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/10.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/11.png" alt="" className="img-fluid rounded-3" />
                        </div>
                        <div className="col-3 col-md-2">
                            <img src="/images/clients/12.png" alt="" className="img-fluid rounded-3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export async function getServerSideProps() {
  try {
    const res = await getPublicPageBySlug("about-us");
    return { props: { pageData: res.data } };
  } catch {
    return { notFound: true };
  }
}

AboutUs.Layout = LandingPageLayout;