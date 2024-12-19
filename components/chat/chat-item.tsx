"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { saveAs } from 'file-saver';

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { usePresence } from "@/components/providers/presence-provider";

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
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
}

const formSchema = z.object({
  content: z.string().min(1),
});

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
  socketQuery
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();
  const { userStatuses } = usePresence();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  });

  const isLoading = form.formState.isSubmitting;
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadImage = (url: string, fileName: string) => {
    console.log("fileUrl:", fileUrl);
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        console.log("blob:", blob);
        const file = new File([blob], fileName, { type: blob.type });
        console.log("file:", file);
        saveAs(file);
      })
      .catch((error) => console.log(error));
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/messages/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [content, form]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative flex items-center w-full p-4 transition group hover:bg-black/5">
      <div className="flex items-start w-full group gap-x-2">
        <UserAvatar
          src={member.profile.imageUrl}
          status={userStatuses[member.profile.userId] || "offline"}
          className="transition cursor-pointer hover:drop-shadow-md"
        />
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="text-sm font-semibold cursor-pointer hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <div className="flex flex-col mt-2">
              <div
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border flex items-center bg-secondary",
                  isExpanded ? "h-full w-full" : "h-48 w-48"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
                onBlur={() => setIsExpanded(false)}
                tabIndex={0}
              >
                <Image
                  src={fileUrl}
                  alt={content || "Image"}
                  className="object-cover z-5"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 bg-secondary/80">
                  <Button
                    size="sm"
                    className="z-10 object-cover"
                    onClick={() => {
                      const filename = `${member.profile.name}_userfile.${fileType}`;
                      downloadImage(fileUrl, filename);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
              {content && (
                <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-300 break-all whitespace-pre-wrap">
                  {renderContent(content)}
                </p>
              )}
            </div>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
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
            <p className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300 break-all whitespace-pre-wrap",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}>
              {renderContent(content)}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full pt-2 gap-x-2"
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 right-5 dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteMessage", {
                apiUrl: `/api/messages/${id}`,
                query: socketQuery,
              })}
              className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}