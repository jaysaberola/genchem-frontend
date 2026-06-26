"use client";

import { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { createTestimonial } from "@/services/testimonialService";
import { toast } from "@/lib/toast";
import { useRouter } from "next/router";

function CreateTestimonial() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [testimony, setTestimony] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !testimony.trim()) {
      toast.error("Name and testimony required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("company", company);
      formData.append("testimony", testimony);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await createTestimonial(formData);

      toast.success("Testimonial created");

      router.push("/testimonials");
    } catch {
      toast.error("Failed to create testimonial");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Create Testimonial</h3>

      <div className="mb-3 col-sm-6">
        <label className="form-label">Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3 col-sm-6">
        <label className="form-label">Company</label>
        <input
          className="form-control"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="mb-3 col-sm-6">
        <label className="form-label">Thumbnail Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setThumbnail(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="mb-3 col-sm-8">
        <label className="form-label">Testimony</label>
        <textarea
          className="form-control"
          rows={4}
          value={testimony}
          onChange={(e) => setTestimony(e.target.value)}
        />
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

CreateTestimonial.Layout = AdminLayout;

export default CreateTestimonial;