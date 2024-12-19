'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
}

export const useNavigation = create<NavigationState>()(
  persist(
    (set) => ({
      isMobileOpen: false,
      setMobileOpen: (open) => set({ isMobileOpen: open }),
      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
    }),
    {
      name: 'navigation-storage',
    }
  )
); 