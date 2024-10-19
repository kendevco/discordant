"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css";
import { track } from "@vercel/analytics";
import toast from "react-hot-toast";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile" | "productImage" | "productPdf";
  value: string;
  onChange: (url: string) => void;
}

export const FileUpload = ({
  onChange,
  value,
  endpoint
}: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone<OurFileRouter>
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          onChange(res[0].url);
          track('File Uploaded', { fileName: res[0].name });
          toast.success("File uploaded successfully!");
        }
      }}
      onUploadError={(error: Error) => {
        track('Upload Failed', { errorMessage: error.message });
        toast.error(`Upload failed: ${error.message}`);
      }}
    />
  )
}
