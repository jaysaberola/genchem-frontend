import { axiosInstance } from "@/services/axios";

/* =========================
   Interfaces
========================= */

export interface TestimonialRow {
  id: number;
  name: string;
  company?: string;
  testimony: string;
  thumbnail?: string;
  created_at?: string;
}

export interface CreateTestimonialPayload {
  name: string;
  company?: string;
  testimony: string;
  thumbnail?: string;
}

interface FetchTestimonialsParams {
  search?: string;
  page?: number;
  per_page?: number;
}

/* =========================
   Fetch Testimonials
========================= */

export const getTestimonials = async (
  params: FetchTestimonialsParams
) => {
  const res = await axiosInstance.get("/testimonials", {
    params,
  });

  return res.data;
};

/* =========================
   Get Single
========================= */

export const getTestimonial = async (id: number) => {
  const res = await axiosInstance.get(`/testimonials/${id}`);
  return res.data;
};

/* =========================
   Create
========================= */

export const createTestimonial = async (formData: FormData) => {
  const res = await axiosInstance.post("/testimonials", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* =========================
   Update
========================= */

export const updateTestimonial = async (id: number, formData: FormData) => {
  const res = await axiosInstance.post(
    `/testimonials/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

/* =========================
   Delete
========================= */

export const deleteTestimonial = async (id: number) => {
  const res = await axiosInstance.delete(`/testimonials/${id}`);
  return res.data;
};