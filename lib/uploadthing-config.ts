import { createUploadthing } from "uploadthing/next";

const token = process.env.NEXT_PUBLIC_UPLOAD_THING_TOKEN;

if (!token) {
  throw new Error(
    "Missing NEXT_PUBLIC_UPLOAD_THING_TOKEN environment variable"
  );
}

export const uploadthing = createUploadthing();
