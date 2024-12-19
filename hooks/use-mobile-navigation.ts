"use client";

import { create } from "zustand";

interface MobileNavigationStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMobileNavigation = create<MobileNavigationStore>((set) => ({
  isOpen: false,
  onOpen: () => {
    document.body.style.setProperty('--nav-width', '72px');
    set({ isOpen: true });
  },
  onClose: () => {
    document.body.style.setProperty('--nav-width', '0px');
    set({ isOpen: false });
  },
})); 