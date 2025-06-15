import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/discordant(.*)',
  '/api/vapi(.*)', 
  '/api/voice-ai(.*)',
  '/api/chat(.*)',
  '/api/external(.*)',
  '/api/webhook(.*)',
  '/api/workflow(.*)',
  '/api/ai(.*)',
  '/api/uploadthing(.*)',
  '/api/socket(.*)',
  '/api/health(.*)',
  '/embed(.*)',
  '/shared(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
