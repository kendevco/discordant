'use client';

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { track } from '@vercel/analytics';
import { useState, useRef } from "react";
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
import { Role } from "@prisma/client";
import AudioInput from "../ai/audio-input";

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
    const textInputRef = useRef<HTMLTextAreaElement>(null);

    const handleClose = () => {
        track('Message File Modal Closed');
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query,
            });

            await axios.post(url, {
                content: values.content,
                fileUrl: values.fileUrl,
                channelId: query?.channelId,
            });

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleTranscriptionComplete = (transcription: string) => {
        form.setValue('content', transcription);
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#313338] text-white p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-2xl font-bold text-center">Add an attachment</DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="px-6 space-y-8">
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
                                            <div className="relative">
                                                <Textarea
                                                    disabled={isSubmitting}
                                                    placeholder="Add a comment or prompt for image analysis..."
                                                    {...field}
                                                    className="border-0 bg-zinc-700/50 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0"
                                                />
                                                <div className="absolute bottom-2 right-2">
                                                    <AudioInput
                                                        onTranscriptionComplete={handleTranscriptionComplete}
                                                        disabled={isSubmitting}
                                                        textInputRef={textInputRef}
                                                    />
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="px-6 py-4 bg-[#2b2d31] flex justify-end">
                            <Button disabled={isSubmitting} type="submit" className="bg-indigo-500 hover:bg-indigo-600">
                                Send
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
