import React, { useEffect, useState } from "react";
import { getTestimonials } from "@/services/testimonialService";

type Testimonial = {
  image: string;
  text: string;
  name: string;
  company: string;
};

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);

  /* =========================
     Fetch Testimonials
  ========================= */
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getTestimonials({
          page: 1,
          per_page: 10,
        });

        const rows = res?.data ?? [];

        const formatted: Testimonial[] = rows.map((item: any) => ({
          image: item.thumbnail,
          text: item.testimony,
          name: item.name,
          company: item.company,
        }));

        setTestimonials(formatted);
      } catch (err) {
        console.error("Failed to load testimonials", err);
      }
    };

    fetchTestimonials();
  }, []);
  
  /* =========================
     Auto Slider
  ========================= */
  useEffect(() => {
    if (!testimonials.length) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(id);
  }, [testimonials]);

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const next = () =>
    setIndex((i) => (i + 1) % testimonials.length);

  if (!testimonials.length) return "No testimonials for now.";

  return (
    <section className="testimonial-root container py-4">
      <div className="heading-block text-center border-0 pb-5" data-heading="W">
        <h2 className="fs-1 fw-bold pb-5">What Our Clients Say</h2>
      </div>

      <div className="testimonial-slider d-flex align-items-center mt-4">
        <button aria-label="Previous testimonial" onClick={prev} className="nav-btn">‹</button>

        <div className="testimonial-card mx-3">
          <div className="d-flex flex-column g-0 align-items-center">
            <div className="col-12 col-md-3 text-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${testimonials[index].image}`}
                alt={testimonials[index].name}
                className="avatar img-fluid rounded-circle overflow-hidden"
              />
            </div>

            <div className="col-12 col-md-9 mt-3 mt-md-0 text-center py-5">
              <p className="text-muted fs-6"><i>“{testimonials[index].text}”</i></p>
              <p className="mb-0 fw-bold">{testimonials[index].name}</p>
              <small className="text-secondary">
                <i>{testimonials[index].company}</i>
              </small>
            </div>
          </div>
        </div>

        <button aria-label="Next testimonial" onClick={next} className="nav-btn">›</button>
      </div>

      <div className="d-flex justify-content-center gap-2 mt-4 indicators">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`dot ${i === index ? "active" : ""}`}
          />
        ))}
      </div>

      <style jsx>{`
        .testimonial-root { max-width: 1100px; }
        .testimonial-slider { gap: 16px; }
        .nav-btn { background: rgba(0,0,0,0%); color:#414141; border:none; cursor:pointer; font-size:52px; }
        .testimonial-card { background:#fff; border-radius:8px; padding:18px; width:100%; }
        .avatar { width:120px; height:120px; object-fit:cover; border-radius:8px; }
        .dot { width:12px; height:12px; border-radius:50%; background:#e6e6e6; border:none; cursor:pointer; }
        .dot.active { background:#ff7b00; }

        @media(max-width:768px){
          .testimonial-slider { flex-direction:column; }
          .nav-btn { align-self:center; }
          .avatar { width:90px; height:90px; }
        }
      `}</style>
    </section>
  );
}