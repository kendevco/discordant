import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  isOpen: boolean;
  isMobileOpen: boolean;
  serverId: string | null;
}

interface NavigationActions {
  onOpen: () => void;
  onClose: () => void;
  onMobileOpen: () => void;
  onMobileClose: () => void;
  setServerId: (id: string | null) => void;
}

type NavigationStore = NavigationState & NavigationActions;

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      // Initial state
      isOpen: false,
      isMobileOpen: false,
      serverId: null,

      // Actions
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
      onMobileOpen: () => set({ isMobileOpen: true }),
      onMobileClose: () => set({ isMobileOpen: false }),
      setServerId: (id) => {
        set({ serverId: id });
        if (id) {
          set({ isOpen: false });
        }
      },
    }),
    {
      name: 'navigation-storage',
    }
  )
); 