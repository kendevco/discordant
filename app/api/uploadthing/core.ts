// /app/api/uploadthing/core.ts

import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { FileProcessingService } from "@/lib/services/file-processing";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) throw new UploadThingError("Unauthorized!");
  return { userId: userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Server image uploaded:`, file.url);
      
      // Basic processing for server images (avatars, etc.)
      // No need for full analysis for server images
      
      return { uploadedBy: metadata.userId };
    }),
    
  messageFile: f(["image", "pdf"])
    .middleware(async () => {
      const auth = await handleAuth();
      
      // Note: UploadThing context extraction is limited in middleware
      // File context will be handled during message creation
      
      return { 
        userId: auth.userId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UPLOADTHING] Message file uploaded:`, file.url);
      console.log(`[UPLOADTHING] Metadata:`, metadata);
      
      try {
        // Trigger enhanced file processing
        // Note: We don't have messageId yet as the message hasn't been created
        // The processing will be triggered after message creation
        
        const processingPromise = FileProcessingService.processUploadedFile(
          file.url,
          undefined, // messageId - will be set later
          undefined, // directMessageId - will be set later  
          metadata.userId,
          undefined, // channelId - handled during message creation
          undefined  // userPrompt - handled during message creation
        );
        
        // Don't await to avoid blocking the upload response
        processingPromise.catch(error => {
          console.error(`[UPLOADTHING] Background processing error:`, error);
        });
        
        return { 
          uploadedBy: metadata.userId,
          fileUrl: file.url,
          processingStarted: true,
        };
        
      } catch (error) {
        console.error(`[UPLOADTHING] Error in onUploadComplete:`, error);
        
        return { 
          uploadedBy: metadata.userId,
          fileUrl: file.url,
          processingStarted: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
