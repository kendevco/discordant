// src/components/modals/leave-server-modal.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomPopup from "@/components/custom-popup";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      setTimeout(() => {
        setIsPopupOpen(true);
      }, 500);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold mb-3">
              Leave Server?
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to leave
              <span className="font-semibold text-indigo-500">
                {server?.name}
              </span>
              ?, you can always ask for an invite link to join back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <Button disabled={isLoading} onClick={onClose} variant="ghost">
                No, take me back
              </Button>
              <Button
                disabled={isLoading}
                onClick={onClick}
                className="hover:bg-red-500 text-black hover:text-white"
              >
                Yes, I confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CustomPopup
        isOpen={isPopupOpen}
        message="You have left the server"
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
};
