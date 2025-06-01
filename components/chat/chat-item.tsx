// src/components/chat/chat-item.tsx
"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter, useParams } from "next/navigation";
import { useSocket } from "@/hooks/use-socket";
import { MessageStatus } from "@/lib/system/types/messagestatus";
import { ImageDialog } from "./image-dialog";
import { RichContentRenderer } from "./rich-content-renderer";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="text-green-500 h-4 w-4 ml-2" />,
  ADMIN: <ShieldCheck className="text-rose-500 h-4 w-4 ml-2" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
  isLast?: boolean;
}

interface MessageStatusIndicatorProps {
  messageId: string;
  isLast?: boolean;
}

const MessageStatusIndicator = ({ messageId, isLast }: MessageStatusIndicatorProps) => {
  const { getMessageStatus } = useSocket();
  const status = getMessageStatus(messageId);

  if (!isLast) return null;

  switch (status?.status) {
    case "sending":
      return <Clock className="h-3 w-3 ml-2 text-zinc-500" />;
    case "sent":
      return <Check className="h-3 w-3 ml-2 text-zinc-500" />;
    case "delivered":
      return <CheckCheck className="h-3 w-3 ml-2 text-green-500" />;
    case "failed":
      return (
        <ActionTooltip label={status.error || "Failed to send"}>
          <AlertCircle className="h-3 w-3 ml-2 text-red-500" />
        </ActionTooltip>
      );
    default:
      return null;
  }
};

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
  isLast,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fileType = fileUrl?.split(".").pop() || undefined;
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  // Check if this is a system message (from system user or contains system indicators)
  const isSystemMessage = member.profile.name === "System" || 
                          content.includes("🔍 **Research Results:**") ||
                          content.includes("📋 **DUTY OFFICER") ||
                          content.includes("✅ **DUTY OFFICER") ||
                          content.includes("🔄 **DUTY OFFICER") ||
                          content.includes("❌ **DUTY OFFICER") ||
                          content.includes("🕐 **DUTY OFFICER") ||
                          content.includes("📅 **DUTY OFFICER");

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl || undefined} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p 
                onClick={onMemberClick} 
                className={cn(
                  "font-semibold text-sm hover:underline cursor-pointer",
                  isSystemMessage && "text-blue-400 dark:text-blue-300"
                )}
              >
                {isSystemMessage ? "🤖 System" : member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
              {timestamp}
              <MessageStatusIndicator messageId={id} isLast={isLast} />
            </span>
          </div>
          {isImage && (
            <>
              <div
                onClick={() => setIsImageDialogOpen(true)}
                className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48 cursor-pointer hover:opacity-90 transition"
              >
                <Image
                  src={fileUrl}
                  alt={content}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <ImageDialog
                isOpen={isImageDialogOpen}
                onClose={() => setIsImageDialogOpen(false)}
                imageUrl={fileUrl}
              />
            </>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <div className={cn(
              "text-sm mt-2",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              isSystemMessage && "bg-zinc-900/50 dark:bg-zinc-800/50 p-3 rounded-lg border-l-4 border-blue-500"
            )}>
              {deleted ? (
                <span className="italic text-zinc-500 dark:text-zinc-400">
                  This message has been deleted
                </span>
              ) : (
                <RichContentRenderer 
                  content={content} 
                  isSystemMessage={isSystemMessage}
                />
              )}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </div>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-x-2 w-full pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={form.formState.isSubmitting}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
        {canDeleteMessage && !isSystemMessage && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            {canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete">
              <Trash
                onClick={() => onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
      </div>
    </div>
  );
};
