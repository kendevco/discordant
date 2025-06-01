// src/components/modals/edit-server-modal.tsx
"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import CustomPopup from "@/components/custom-popup";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl || "");
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      form.reset();
      onClose();
      router.refresh();
      setTimeout(() => {
        setIsPopupOpen(true);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold text-zinc-200 mb-3">
              Edit your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Edit your server name and image
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="px-6 space-y-8">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-300">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-700/50 border-0 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0"
                          placeholder="Enter a server name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-400">
                        This is the name of your server
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-zinc-800/50 px-6 py-4">
                <Button
                  variant="primary"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:bg-zinc-500"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <CustomPopup
        isOpen={isPopupOpen}
        message="Server edited successfully!"
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
};
