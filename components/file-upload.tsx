"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image fill src={value} alt="Upload file" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full shadow-sm hover:bg-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-foreground/5 dark:bg-background/10">
        <FileIcon className="w-10 h-10 fill-primary stroke-secondary" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-primary hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="absolute p-1 text-white bg-red-600 rounded-full shadow-sm -top-0 -right-2 hover:bg-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onChange(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
      onUploadBegin={() => {
        console.log("Upload starting...");
      }}
    />
  );
};
