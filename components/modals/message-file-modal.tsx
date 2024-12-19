'use client';

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { track } from '@vercel/analytics';
import { useState } from "react";
import toast from "react-hot-toast";

import { 
    Dialog, 
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";

import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required." 
    }),
    content: z.string().optional()
});

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
            content: ""
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        track('Message File Modal Closed');
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const submitUrl = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            await axios.post(submitUrl, {
                content: values.content,
                fileUrl: values.fileUrl,
            });

            form.reset();
            router.refresh();
            handleClose();
            toast.success("Message with file sent successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.");
            track('Error', { message: "Failed to send message. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-2xl font-bold text-center">Add an attachment</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                    control={form.control}
                                    name="fileUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting}
                                                placeholder="Add a comment or prompt for image analysis..."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="px-6 py-4 bg-gray-100 flex justify-end">
                            <Button disabled={isSubmitting} type="submit">
                                Send
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
