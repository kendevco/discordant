"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type UnifiedNavigationContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const UnifiedNavigationContext = createContext<UnifiedNavigationContextType>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
});

export const useUnifiedNavigation = () => {
  return useContext(UnifiedNavigationContext);
};

export const UnifiedNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add dependency array to prevent infinite updates
  useEffect(() => {
    if (params?.serverId) {
      setIsOpen(false);
    }
  }, [params?.serverId]); // Only run when serverId changes

  if (!isMounted) {
    return null;
  }

  return (
    <UnifiedNavigationContext.Provider
      value={{
        isOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => setIsOpen(false),
      }}
    >
      {children}
    </UnifiedNavigationContext.Provider>
  );
}; 