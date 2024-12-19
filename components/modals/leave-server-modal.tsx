'use client';
import axios from "axios";
import { track } from '@vercel/analytics';

import { 
    Dialog, 
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const LeaveServerModal = () => {

    const { onOpen, isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "leaveServer";

    const { server } = data;  

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        // Track the modal close event
        track('Leave Server Modal Closed');
        onClose();
    };

    const handleConfirm = async () => {
        if (!data.server) return;
        // Track the leave server event
        track('Server Left', { serverId: data.server.id });
        try {
            setIsLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);
            onClose();
            router.refresh();
            router.push("/")

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }   
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden mx-4">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave <span
                        className="font-semibold text-indigo-500"
                        >{server?.name}</span>                         
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter
                    className="bg-gray-100 px-6 py-4"
                >
                    <div className="flex items-center justify-between w-full">
                        <Button 
                            disabled={isLoading}
                            onClick={handleClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={handleConfirm}
                            variant="primary"  
                        >
                            Confirm 
                        </Button>
                    </div>

                </DialogFooter>

            </DialogContent>
        </Dialog>
      );
}

 
