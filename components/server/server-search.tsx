"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
    | {
      icon: React.ReactNode;
      name: string;
      id: string;
    }[]
    | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "member") {
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
    if (type === "channel") {
      router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gradient-to-br hover:from-[#7364c0]/10 hover:to-[#02264a]/10 dark:hover:from-[#000C2F]/10 dark:hover:to-[#003666]/10 transition"
      >
        <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300 transition" />
        <p className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800/50 px-1.5 font-mono text-[10px] font-medium text-zinc-400 ml-auto">
          <span className="text-xs">CTRL+S</span>
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
          <VisuallyHidden>
            <DialogTitle>Search Channels and Members</DialogTitle>
          </VisuallyHidden>
          <CommandInput
            placeholder="Search all channels and members"
            className="bg-zinc-700/50 border-0 focus:ring-0 text-zinc-200 placeholder:text-zinc-400"
          />
          <CommandList className="bg-black/10 text-zinc-200">
            <CommandEmpty className="py-4 text-zinc-400">
              No results found
            </CommandEmpty>
            {data.map(({ label, data, type }) => {
              if (!data?.length) return null;
              return (
                <CommandGroup key={label} heading={label} className="text-zinc-400">
                  {data?.map(({ id, icon, name }) => {
                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => onClick({ id, type })}
                        className="hover:bg-zinc-700/50 text-zinc-200"
                      >
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};
