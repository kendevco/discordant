"use client";

import { MessageProvider } from "./message-provider";
import { PresenceProvider } from "./presence-provider";
import { QueryProvider } from "./query-provider";
import { ModalProvider } from "./modal-provider";
import { ToastProvider } from "./toast-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <MessageProvider>
        <PresenceProvider>
          <ToastProvider />
          <ModalProvider>
            {children}
          </ModalProvider>
        </PresenceProvider>
      </MessageProvider>
    </QueryProvider>
  );
}; 