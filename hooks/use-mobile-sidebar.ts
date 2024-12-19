import { create } from "zustand";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect } from "react";

interface MobileSidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMobileSidebarStore = create<MobileSidebarStore>((set) => ({
  isOpen: false,
  onOpen: () => {
    set({ isOpen: true });
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // Prevent layout shift
    }
  },
  onClose: () => {
    set({ isOpen: false });
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  },
}));

export const useMobileSidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { onClose, isOpen, onOpen } = useMobileSidebarStore();

  useEffect(() => {
    if (isDesktop && isOpen) {
      onClose();
    }
  }, [isDesktop, isOpen, onClose]);

  return {
    isOpen,
    onOpen: () => {
      if (!isDesktop) {
        onOpen();
      }
    },
    onClose,
  };
};
