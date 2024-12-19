import { createUploadthing } from "uploadthing/next";

const token = process.env.UPLOADTHING_TOKEN;
if (!token) {
  throw new Error("Missing UPLOADTHING_TOKEN environment variable");
}

// Validate token format
try {
  const decoded = JSON.parse(atob(token.split('.')[1]));
  if (!decoded.apiKey || !decoded.appId || !decoded.regions) {
    throw new Error("Invalid token format");
  }
} catch (error) {
  console.error("Error validating UPLOADTHING_TOKEN:", error);
  throw new Error("Invalid UPLOADTHING_TOKEN format");
}

export const uploadthing = createUploadthing({
  token: process.env.UPLOADTHING_TOKEN,
});