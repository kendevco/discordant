'use client';

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/use-custom-toast";

import { 
    Dialog, 
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required." 
        })  
});

export const CreateServerModal = () => {

    const {isOpen, onClose, type} = useModal();
    const router = useRouter();
    const toast = useCustomToast();

    const isModalOpen = isOpen && type === "createServer";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            onClose();
            toast.success("Server created successfully!");
        } catch (error) {
            toast.error("Failed to create server. Please try again.");
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden mx-4">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Create your server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-8 mx-4" >
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                    >
                                        Server name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            { ...field }
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter server name"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button disabled={isLoading} variant="primary">
                            Create
                        </Button>
                                
                    
                    </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      );
}

 
