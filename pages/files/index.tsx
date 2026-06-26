import { useMemo, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

type FileManagerMode = "Images" | "Files";

export default function FileManagerPage() {
  const [mode, setMode] = useState<FileManagerMode>("Files");

  const iframeSrc = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return `${base}/laravel-filemanager?type=${mode}`;
  }, [mode]);

  return (
    <div className="container">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h3 className="mb-0">File Manager</h3>
        <div className="btn-group" role="group" aria-label="File manager mode">
          <button
            type="button"
            className={`btn btn-sm ${mode === "Images" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setMode("Images")}
          >
            Images
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mode === "Files" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setMode("Files")}
          >
            Files &amp; Videos
          </button>
        </div>
      </div>

      <p className="text-muted small mb-3">
        Upload videos (MP4, WebM, MOV, etc.) using the <strong>Files &amp; Videos</strong> tab.
      </p>

      <div
        style={{
          width: "100%",
          height: "75vh",
          border: "1px solid #dee2e6",
          borderRadius: 6,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <iframe
          key={mode}
          src={iframeSrc}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          loading="lazy"
          title="File Manager"
        />
      </div>
    </div>
  );
}

FileManagerPage.Layout = AdminLayout;
