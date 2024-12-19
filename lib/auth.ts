import { auth } from "@clerk/nextjs/server";

export function getRedirectUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export async function safeRedirectToSignIn(path: string) {
  try {
    const redirectUrl = getRedirectUrl(path);
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({ returnBackUrl: redirectUrl });
  } catch (error) {
    console.error("Error in safeRedirectToSignIn:", error);
    const { redirectToSignIn } = await auth();
    return redirectToSignIn({ returnBackUrl: getRedirectUrl("/") });
  }
}
