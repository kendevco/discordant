import { authMiddleware } from "@clerk/nextjs";

// Add routes that should be accessible without authentication
export default authMiddleware({
  publicRoutes: [
    "/api/uploadthing",
    "/servers/:serverId/conversations/:memberId",
    "/api/direct-messages",
    // Add other public routes here as needed
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
