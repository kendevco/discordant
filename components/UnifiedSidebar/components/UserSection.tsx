'use client';

import React from 'react';
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

export interface UserSectionProps {
  profile?: any; // Made optional with ?
}

export function UserSection({ profile }: UserSectionProps): JSX.Element {
  return (
    <div className="mt-auto p-4 bg-[#232428] flex items-center gap-x-2">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-[32px] w-[32px]"
          }
        }}
      />
      <ModeToggle />
    </div>
  );
} 