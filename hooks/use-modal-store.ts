import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from 'zustand';

export type ModalType = "createServer" | "invite" | "editServer"
 | "members" | "createChannel" | "leaveServer" | "deleteServer"
 | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModalState {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    activeModals: Set<string>;
}

interface ModalStore extends ModalState {
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

const safeRemoveElement = (element: Element) => {
    try {
        if (element && element.parentElement && document.body.contains(element)) {
            element.parentElement.removeChild(element);
        }
    } catch (error) {
        console.warn('Safe remove failed:', error);
    }
};

export const useModal = create<ModalStore>((set, get) => ({
    type: null,
    data: {},
    isOpen: false,
    activeModals: new Set(),

    onOpen: (type, data = {}) => {
        set({ 
            isOpen: true, 
            type, 
            data,
            activeModals: new Set([...Array.from(get().activeModals), type])
        });
    },

    onClose: () => {
        const currentState = get();
        
        // Remove the current modal from active modals
        const newActiveModals = new Set(currentState.activeModals);
        if (currentState.type) {
            newActiveModals.delete(currentState.type);
        }

        // Reset document styles only if no modals are active
        if (newActiveModals.size === 0) {
            // Reset body styles
            if (document.body) {
                document.body.style.pointerEvents = '';
                document.body.style.overflow = '';
                document.body.removeAttribute('aria-hidden');
            }

            // Schedule cleanup for next frame to allow React to finish its work
            requestAnimationFrame(() => {
                // Remove any lingering backdrop elements
                document.querySelectorAll('[data-backdrop]').forEach(safeRemoveElement);

                // Remove any lingering modal-related classes from the root element
                const root = document.documentElement;
                root.classList.remove('overflow-hidden');
                root.style.pointerEvents = '';
                
                // Clean up any remaining modal-related attributes
                document.querySelectorAll('[role="dialog"]').forEach(safeRemoveElement);
            });
        }

        // Reset the state
        set({ 
            type: null, 
            isOpen: false, 
            data: {},
            activeModals: newActiveModals
        });
    }
}));
