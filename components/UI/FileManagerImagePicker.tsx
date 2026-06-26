import React from "react";
import { openFileManagerPicker } from "@/lib/mediaAssets";

type FileManagerImagePickerProps = {
  label?: string;
  pickerType?: "Images" | "Files";
  onSelect: (url: string) => void;
  className?: string;
};

export default function FileManagerImagePicker({
  label = "Choose from Files",
  pickerType = "Images",
  onSelect,
  className = "btn btn-outline-secondary btn-sm",
}: FileManagerImagePickerProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openFileManagerPicker(pickerType, onSelect)}
    >
      <i className="fa fa-folder-open me-1" aria-hidden="true" />
      {label}
    </button>
  );
}
