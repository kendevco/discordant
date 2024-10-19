import { redirectToSignIn } from "@clerk/nextjs";

export function getRedirectUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function safeRedirectToSignIn(path: string) {
  try {
    const redirectUrl = getRedirectUrl(path);
    return redirectToSignIn({ returnBackUrl: redirectUrl });
  } catch (error) {
    console.error("Error in safeRedirectToSignIn:", error);
    // Fallback to home page if there's an error
    return redirectToSignIn({ returnBackUrl: getRedirectUrl('/') });
  }
}
