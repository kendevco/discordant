import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Added by Antonio 1:53:38 implementing auth from vendor provided example.
const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
}


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({image: { maxFileSize: "4MB", maxFileCount: 1   }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;