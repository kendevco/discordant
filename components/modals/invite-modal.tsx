// src/components/modals/invite-modal.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw, Link as LinkIcon } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Only construct invite URL if server and inviteCode exist
  const inviteUrl = server?.inviteCode ? `${origin}/invite/${server.inviteCode}` : "";

  const onCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      if (!server?.id) return;

      const response = await axios.patch(`/api/servers/${server.id}/invite-code`);
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-4xl text-center font-bold text-zinc-200 mb-3">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Share this link with your friends and colleagues to invite them
            to join {server?.name || "the server"}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-300">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <div className="flex-1 relative">
              <Input
                disabled={isLoading || !server}
                className="bg-zinc-700/50 border-0 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0 pr-12"
                value={inviteUrl}
                readOnly
                placeholder="Loading invite link..."
              />
              <LinkIcon className="absolute right-3 top-2.5 h-5 w-5 text-zinc-400" />
            </div>
            <Button
              size="icon"
              onClick={onCopy}
              disabled={isLoading || !inviteUrl}
              className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:bg-zinc-500"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading || !server}
            onClick={onNew}
            variant="link"
            size="sm"
            className="text-zinc-400 hover:text-zinc-300 mt-4 text-xs transition-colors disabled:text-zinc-600"
          >
            Generate a new link
            <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
