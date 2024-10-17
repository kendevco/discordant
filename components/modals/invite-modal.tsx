'use client';
import axios from "axios";
import { track } from '@vercel/analytics';

import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";

export const InviteModal = () => {

    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin(); 

    const isModalOpen = isOpen && type === "invite";

    const { server } = data;  

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${(server as any)?.inviteCode}`;
 
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);   
    }

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${(server as any)?.id}/invite-code`);

            onOpen("invite", {server: response.data});

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        // Track the modal close event
        track('Invite Modal Closed');
        onClose();
    };

    const handleCopy = () => {
        // Track the copy invite link event
        if (data.server) {
            track('Invite Link Copied', { serverId: data.server.id });
        }
        onCopy();
    };

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden mx-4">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className="uppercase text-xs font-bold 
                        text-zinc-500 dark:text-secondary/70"

                    >
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}  
                            className="bg-zinc-300/50 border-0 
                            focus-visible:ring-0 text-black
                            focus-visible:ring-offset-0 w-full"
                            value={inviteUrl}
                        />
                        <Button onClick={handleCopy} size="icon" disabled={isLoading}>
                            {copied
                                ? <Check className="h-4 w-4" />
                                : <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                    <Button 
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="h-4 w-4 ml-2" />
                    </Button>


                </div>

            </DialogContent>
        </Dialog>
      );
}

 
