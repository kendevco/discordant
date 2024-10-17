import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/uploadthing",
    "/api/direct-messages"
  ],
  ignoredRoutes: [
    "/((?!api|trpc))(_next|.+\\..+)(.*)"
  ],
  afterAuth: (auth, req, evt) => {
    if (!auth.userId) {
      const originalUrl = req.nextUrl.pathname + req.nextUrl.search;
      return redirectToSignIn({ returnBackUrl: originalUrl });
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
