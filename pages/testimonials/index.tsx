"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import { useRouter } from "next/router";
import {
  getTestimonials,
  TestimonialRow,
  deleteTestimonial,
} from "@/services/testimonialService";

function ManageTestimonials() {
  const router = useRouter();

  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortRowsClientSide = (
    rows: TestimonialRow[],
    by: string,
    order: "asc" | "desc"
  ) => {
    const direction = order === "asc" ? 1 : -1;
    const copy = [...rows];

    copy.sort((a: any, b: any) => {
      const av = (a as any)?.[by];
      const bv = (b as any)?.[by];

      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * direction;

      const as = av == null ? "" : String(av).toLowerCase();
      const bs = bv == null ? "" : String(bv).toLowerCase();

      if (as < bs) return -1 * direction;
      if (as > bs) return 1 * direction;
      return 0;
    });

    return copy;
  };

  /* ======================
   * Fetch Testimonials
   * ====================== */
  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const res = await getTestimonials({
        search,
        page: currentPage,
        per_page: perPage,
      });

      const apiRows: TestimonialRow[] = Array.isArray(res?.data)
        ? res.data
        : [];

      setTestimonials(apiRows);
      setTotalPages(res?.last_page ?? 1);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
   * Effects
   * ====================== */
  useEffect(() => {
    const timeout = setTimeout(fetchTestimonials, 400);
    return () => clearTimeout(timeout);
  }, [search, currentPage, perPage]);

  const sortedTestimonials = useMemo(
    () => sortRowsClientSide(testimonials, sortBy, sortOrder),
    [testimonials, sortBy, sortOrder]
  );

  /* ======================
   * Delete
   * ====================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      await deleteTestimonial(id);
      fetchTestimonials();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ======================
   * Columns
   * ====================== */
  const columns: Column<TestimonialRow>[] = [
  {
    key: "select",
    header: <input type="checkbox" />,
    render: () => <input type="checkbox" />,
  },
  {
    key: "thumbnail",
    header: "Photo",
    render: (row) =>
      row.thumbnail ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${row.thumbnail}`}
          alt={row.name}
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <span className="text-muted small">-</span>
      ),
  },
  {
    key: "name",
    header: "Name",
    sortable: true,
    sortField: "name",
    defaultSortOrder: "asc",
    render: (row) => (
      <span className="fw-bold text-primary">{row.name}</span>
    ),
  },
  {
    key: "company",
    header: "Company",
    sortable: true,
    sortField: "company",
    defaultSortOrder: "asc",
    render: (row) => (
      <span className="text-muted small">
        {row.company ?? "-"}
      </span>
    ),
  },
  {
    key: "testimony",
    header: "Testimony",
    render: (row) => (
      <span className="text-muted small">
        {row.testimony?.substring(0, 60)}...
      </span>
    ),
  },
  {
    key: "options",
    header: "Options",
    render: (row) => (
      <>
        <button
          className="btn btn-link p-0 me-2 text-secondary"
          title="Edit"
          onClick={() =>
            router.push(`/testimonials/edit/${row.id}`)
          }
        >
          <i className="fas fa-edit" />
        </button>

        <button
          className="btn btn-link p-0 text-danger"
          title="Delete"
          onClick={() => handleDelete(row.id)}
        >
          <i className="fas fa-trash" />
        </button>
      </>
    ),
  },
];

  /* ======================
   * UI
   * ====================== */
  return (
    <div className="container">
      <h3 className="mb-3">Manage Testimonials</h3>

      <SearchBar
        placeholder="Search testimonials"
        value={search}
        onChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        leftExtras={
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Show</span>
            <select
              className="form-select form-select-sm w-auto"
              value={perPage}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPerPage(value);
                setCurrentPage(1);
              }}
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-muted small">entries</span>
          </div>
        }
      />

      <DataTable<TestimonialRow>
        columns={columns}
        data={sortedTestimonials}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(nextBy, nextOrder) => {
          setSortBy(nextBy);
          setSortOrder(nextOrder);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

ManageTestimonials.Layout = AdminLayout;

export default ManageTestimonials;