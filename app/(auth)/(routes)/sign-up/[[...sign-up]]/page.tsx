'use client';

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#313338] border-0",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-white",
            formButtonPrimary: "bg-indigo-500 hover:bg-indigo-600",
            footerActionLink: "text-indigo-500 hover:text-indigo-600"
          }
        }}
      />
    </div>
  );
}