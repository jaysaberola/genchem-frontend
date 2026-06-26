"use client";

import { useState } from "react";
import { MenuItem } from "./types";

interface Props {
  onAdd: (item: MenuItem) => void;
}

export default function CustomUrlPanel({ onAdd }: Props) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (!label.trim() || !url.trim()) return;

    onAdd({
      id: Date.now(), // unique temp id
      label,
      type: "url",
      target: url,
      children: [],
    });

    setLabel("");
    setUrl("");
  };

  return (
    <div className="border rounded p-3 mt-3">
      <h6>Custom URL</h6>

      <div className="mb-2">
        <input
          className="form-control"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <input
          className="form-control"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success btn-sm w-100"
        onClick={handleAdd}
        disabled={!label || !url}
      >
        + ADD
      </button>
    </div>
  );
}
