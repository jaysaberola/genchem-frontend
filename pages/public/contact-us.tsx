import LandingPageLayout from "@/components/Layout/GuestLayout";
import { getPublicPageBySlug, PublicPage } from "@/services/publicPageService";
import { sendContactMessage } from "@/services/publicPageService";
import { useState } from "react";

interface PublicPageViewProps {
  pageData: PublicPage;
}

export default function ContactUsPage({ pageData }: PublicPageViewProps) {
  const [form, setForm] = useState({
    inquiry_type: "",
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await sendContactMessage(form);
      setSuccess("Thank you! Your message has been sent successfully.");
      setForm({
        inquiry_type: "",
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        message: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="p-t-80 p-b-80">

        <div className="row">

          {/* LEFT – CONTACT INFO */}
          <div
            className="col-md-4 col-lg-3 contact-us-page-container"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />

          {/* RIGHT – FORM + MAP */}
          <div className="col-md-8 col-lg-9">

            {/* MAP */}
            <div className="blo4 bo-rad-10 of-hidden m-b-40">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3180.679829237603!2d120.99551370002625!3d14.711242306152204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b15d90bad309%3A0x9bcea0c7ab90315b!2s645%20Paso%20de%20Blas%20Rd%2C%20Valenzuela%2C%201442%20Metro%20Manila!5e1!3m2!1sen!2sph!4v1772501653659!5m2!1sen!2sph" 
              width="100%" 
              height="450" 
              style={{border: 0}} 
              loading="lazy">
              </iframe>
            </div>

            {/* FORM */}
            <div className="blo4 p-30">
              <h4 className="p-b-20">Send Us a Message</h4>

              {success && <p className="txt14 text-success p-b-10">{success}</p>}
              {error && <p className="txt14 text-danger p-b-10">{error}</p>}

              <form onSubmit={submit}>
                {/* INQUIRY TYPE */}
                <div className="row p-b-25">
                  <div className="col-md-6">
                    <label className="txt14 p-b-5 dis-block">Inquiry Type *</label>
                    <div className="size30 bo2 bo-rad-10 rounded">
                      <select
                        className="sizefull txt14 p-l-20 p-r-20 rounded"
                        name="inquiry_type"
                        value={form.inquiry_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select inquiry type</option>
                        <option>General Inquiry</option>
                        <option>Customer Support</option>
                        <option>Business Partnership</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* NAME */}
                <div className="row p-b-25">
                  <div className="col-md-6">
                    <label className="txt14 p-b-5 dis-block">First Name *</label>
                    <div className="size30 bo2 bo-rad-10 rounded">
                      <input
                        className="sizefull txt14 p-l-20 p-r-20 rounded"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="txt14 p-b-5 dis-block">Last Name *</label>
                    <div className="size30 bo2 bo-rad-10 rounded">
                      <input
                        className="sizefull txt14 p-l-20 p-r-20 rounded"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="row p-b-25">
                  <div className="col-md-6">
                    <label className="txt14 p-b-5 dis-block">Email *</label>
                    <div className="size30 bo2 bo-rad-10 rounded">
                      <input
                        type="email"
                        className="sizefull txt14 p-l-20 p-r-20 rounded"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="txt14 p-b-5 dis-block">Contact Number *</label>
                    <div className="size30 bo2 bo-rad-10 rounded">
                      <input
                        className="sizefull txt14 p-l-20 p-r-20 rounded"
                        name="contact_number"
                        value={form.contact_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="p-b-30">
                  <label className="txt14 p-b-5 dis-block">Message *</label>
                  <div className="rounded">
                    <textarea
                      className="sizefull txt14 p-l-20 p-r-20 p-t-15 rounded"
                      rows={6}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn3 flex-c-m size31 txt11 trans-0-4"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Message"}
                </button>
              </form>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await getPublicPageBySlug("contact-us");
    return { props: { pageData: res.data } };
  } catch {
    return { notFound: true };
  }
}

ContactUsPage.Layout = LandingPageLayout;
