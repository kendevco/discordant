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
import qs from "query-string";
import CustomPopup from "@/components/custom-popup";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
      setTimeout(() => {
        setIsPopupOpen(true);
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold mb-3 text-zinc-200">
              Delete Message?
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Are you sure you want to delete this message?
              <br />
              <span className="text-rose-500">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-zinc-800/50 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <Button
                disabled={isLoading}
                onClick={onClose}
                variant="ghost"
                className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                onClick={onClick}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CustomPopup
        isOpen={isPopupOpen}
        message="Message deleted successfully!"
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
};
