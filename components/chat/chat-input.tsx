// src/components/chat/chat-input.tsx
"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Send } from "lucide-react";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { useRouter } from "next/navigation";
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState("");
  const [isResearching, setIsResearching] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Check if this looks like a research request
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrls = urlRegex.test(data.content);
      
      if (hasUrls) {
        setIsResearching(true);
      }

      const url = qs.stringifyUrl({
        url: apiUrl,
        query: query,
      });

      await axios.post(url, {
        content: data.content,
        fileUrl: fileUrl || undefined,
        serverId: query?.serverId,
        channelId: query?.channelId,
      });

      form.reset();
      setFileUrl("");
      setIsResearching(false);
    } catch (error) {
      console.error("[CHAT_INPUT_SUBMIT]", error);
      setIsResearching(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const getPlaceholderText = () => {
    const baseText = `Message ${type === "conversation" ? name : "#" + name}`;
    return `${baseText} (Shift+Enter for new line, paste URLs for research)`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center z-10"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  
                  <div className="px-14 pr-24">
                    <Textarea
                      placeholder={getPlaceholderText()}
                      disabled={isLoading || isResearching}
                      className="min-h-[48px] max-h-32 resize-none bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                      onKeyDown={handleKeyDown}
                      {...field}
                    />
                  </div>

                  <div className="absolute top-7 right-16">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || isResearching || !field.value.trim()}
                    size="sm"
                    variant="ghost"
                    className="absolute top-7 right-8 h-[24px] w-[24px] p-0 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 text-zinc-400 hover:text-zinc-300 transition" />
                  </Button>

                  {isResearching && (
                    <div className="absolute bottom-1 left-4 text-xs text-zinc-400 dark:text-zinc-500">
                      🔍 Researching URLs...
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
