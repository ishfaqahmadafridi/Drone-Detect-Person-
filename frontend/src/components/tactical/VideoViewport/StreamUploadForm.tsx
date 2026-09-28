"use client";

import React from "react";
import { Upload } from "lucide-react";
import { StreamUploadFormProps } from "@/types";

export const StreamUploadForm: React.FC<StreamUploadFormProps> = ({
  show,
  isUploading,
  fileInputRef,
  onFileUpload,
}) => {
  if (!show) return null;

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={onFileUpload}
        className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-400 cursor-pointer"
      />
      {isUploading && (
        <span className="flex items-center gap-1 text-xs text-cyan-400 animate-pulse">
          <Upload className="w-3.5 h-3.5 animate-bounce" /> Uploading...
        </span>
      )}
    </div>
  );
};
