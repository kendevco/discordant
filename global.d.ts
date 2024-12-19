declare module "@clerk/nextjs" {
  export * from "@clerk/nextjs/dist/types";

  // Auth helpers
  export const auth: () => Promise<{ userId: string | null }>;
  export const currentUser: () => Promise<any>;
  export const redirectToSignIn: (options?: { returnBackUrl?: string }) => any;

  // Components
  export const ClerkProvider: React.ComponentType<{
    children: React.ReactNode;
  }>;
  export const SignIn: React.ComponentType<{
    afterSignInUrl?: string;
    redirectUrl?: string;
    appearance?: any;
  }>;
  export const SignUp: React.ComponentType<{
    afterSignUpUrl?: string;
    redirectUrl?: string;
    appearance?: any;
  }>;
  export const UserButton: React.ComponentType<{
    afterSignOutUrl?: string;
    appearance?: any;
  }>;

  // Hooks
  export const useUser: () => {
    isLoaded: boolean;
    isSignedIn: boolean;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
      emailAddresses: Array<{ emailAddress: string }>;
    } | null;
  };

  // Server Components
  export const getAuth: () => Promise<{ userId: string | null }>;
  export { currentUser } from "@clerk/nextjs/server";
  export { redirectToSignIn } from "@clerk/nextjs/server";
}
