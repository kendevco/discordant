'use client';

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-gradient-to-br from-gray-800/90 via-gray-800/95 to-indigo-900/90 border-0 shadow-xl",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-zinc-300",
            socialButtonsBlockButton: "bg-white hover:bg-zinc-100",
            formButtonPrimary: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            formFieldLabel: "text-zinc-300",
            formFieldInput: "bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400",
            dividerLine: "bg-zinc-700",
            dividerText: "text-zinc-400",
            identityPreviewText: "text-zinc-300",
            formFieldAction: "text-indigo-400 hover:text-indigo-300"
          },
          variables: {
            colorPrimary: "#6366f1",
            colorText: "#ffffff",
            colorTextSecondary: "#a1a1aa",
            colorBackground: "transparent",
            colorInputText: "#ffffff",
            colorInputBackground: "rgba(39, 39, 42, 0.5)",
            colorInputBorder: "#3f3f46"
          }
        }}
      />
    </div>
  );
}