/**
 * Utility functions for managing UploadThing file cleanup
 */

import { UTApi } from "uploadthing/server";

/**
 * Extract file key from UploadThing URL
 * @param url - The UploadThing file URL
 * @returns The file key or null if extraction fails
 */
export function extractFileKey(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') return null;
    
    // Handle both old and new UploadThing URL formats
    if (url.includes('utfs.io/f/')) {
      return url.split('/f/')[1]?.split('?')[0] || null;
    }
    
    // Fallback to taking the last part of the URL
    return url.split('/').pop()?.split('?')[0] || null;
  } catch (error) {
    console.error('[EXTRACT_FILE_KEY] Error extracting file key:', error);
    return null;
  }
}

/**
 * Delete a single file from UploadThing
 * @param fileUrl - The UploadThing file URL to delete
 * @param context - Context string for logging (e.g., "SERVER_UPDATE", "PROFILE_DELETE")
 * @returns Promise<boolean> - true if successful, false if failed
 */
export async function deleteUploadThingFile(fileUrl: string, context: string = "FILE_DELETE"): Promise<boolean> {
  try {
    const fileKey = extractFileKey(fileUrl);
    if (!fileKey) {
      console.log(`[${context}] No valid file key found in URL: ${fileUrl}`);
      return false;
    }

    const utapi = new UTApi();
    await utapi.deleteFiles([fileKey]);
    console.log(`[${context}] Successfully deleted file: ${fileKey}`);
    return true;
  } catch (error) {
    console.error(`[${context}] Failed to delete file:`, error);
    return false;
  }
}

/**
 * Delete multiple files from UploadThing
 * @param fileUrls - Array of UploadThing file URLs to delete
 * @param context - Context string for logging
 * @returns Promise<{ success: number; failed: number }> - Count of successful and failed deletions
 */
export async function deleteUploadThingFiles(fileUrls: string[], context: string = "BULK_DELETE"): Promise<{ success: number; failed: number }> {
  const fileKeys = fileUrls
    .map(url => extractFileKey(url))
    .filter((key): key is string => key !== null);

  if (fileKeys.length === 0) {
    console.log(`[${context}] No valid file keys found in URLs`);
    return { success: 0, failed: fileUrls.length };
  }

  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(fileKeys);
    console.log(`[${context}] Successfully deleted ${fileKeys.length} files:`, fileKeys);
    return { success: fileKeys.length, failed: fileUrls.length - fileKeys.length };
  } catch (error) {
    console.error(`[${context}] Failed to delete files:`, error);
    return { success: 0, failed: fileUrls.length };
  }
}

/**
 * Cleanup old file when updating to a new one
 * @param oldFileUrl - The old file URL to delete
 * @param newFileUrl - The new file URL (for comparison)
 * @param context - Context string for logging
 * @returns Promise<boolean> - true if cleanup was successful or not needed
 */
export async function cleanupOldFile(oldFileUrl: string | null, newFileUrl: string | null, context: string): Promise<boolean> {
  // Only cleanup if we have an old file and it's different from the new one
  if (!oldFileUrl || !newFileUrl || oldFileUrl === newFileUrl) {
    return true;
  }

  return await deleteUploadThingFile(oldFileUrl, context);
} 