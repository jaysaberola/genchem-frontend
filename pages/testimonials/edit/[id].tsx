"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import {
  getTestimonial,
  updateTestimonial,
} from "@/services/testimonialService";
import { toast } from "@/lib/toast";
import { useRouter } from "next/router";

function EditTestimonial() {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [testimony, setTestimony] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ======================
   * Fetch Testimonial
   * ====================== */
  const fetchTestimonial = async () => {
    if (!id) return;

    try {
      const res = await getTestimonial(Number(id));

      setName(res.name ?? "");
      setCompany(res.company ?? "");
      setTestimony(res.testimony ?? "");
      setPreview(res.thumbnail ?? null);
    } catch (err) {
      toast.error("Failed to load testimonial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonial();
  }, [id]);

  /* ======================
   * Update
   * ====================== */
  const handleSave = async () => {
    if (!name.trim() || !testimony.trim()) {
      toast.error("Name and testimony required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("_method", "PUT");
      formData.append("name", name);
      formData.append("company", company);
      formData.append("testimony", testimony);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await updateTestimonial(Number(id), formData);

      toast.success("Testimonial updated");

      router.push("/testimonials");
    } catch (err) {
      toast.error("Failed to update testimonial");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container">
      <h3 className="mb-4">Edit Testimonial</h3>

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
        <label className="form-label">Thumbnail</label>

        {preview && (
          <div className="mb-2">
            <img
              src={preview}
              style={{
                width: 70,
                height: 70,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        )}

        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setThumbnail(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
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
          {saving ? "Updating..." : "Update"}
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

EditTestimonial.Layout = AdminLayout;

export default EditTestimonial;