"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useMessages } from "./message-provider";

type UserStatus = "online" | "idle" | "offline";

interface PresenceContextType {
  userStatuses: Record<string, UserStatus>;
}

const PresenceContext = createContext<PresenceContextType>({
  userStatuses: {},
});

export const usePresence = () => {
  return useContext(PresenceContext);
};

export const PresenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({});
  const { isConnected, subscribe } = useMessages();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe((event) => {
      if (event.type === "presence") {
        const status = event.data.status as UserStatus;
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [event.data.userId]: status || "offline"
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, subscribe]);

  return (
    <PresenceContext.Provider value={{ userStatuses }}>
      {children}
    </PresenceContext.Provider>
  );
}; 