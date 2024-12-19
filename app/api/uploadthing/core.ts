import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth, currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

export const ourFileRouter = {
  serverImage: f(
    { image: { maxFileSize: "4MB", maxFileCount: 1 } },
    { awaitServerData: false }
  )
    .middleware(async () => {
      try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");
        return { userId: user.id };
      } catch (error) {
        console.error("serverImage middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { url: file.url };
    }),

  messageFile: f(["image", "pdf"], { awaitServerData: false })
    .middleware(async () => {
      try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");
        return { userId: user.id };
      } catch (error) {
        console.error("messageFile middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
