// src/components/modals/members-modal.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect, useCallback } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  UserPlus,
  Search,
  Plus,
  Users,
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addMembers } from "@/app/actions/addMembers";
import { removeMember } from "@/app/actions/removeMember";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-black-500 ml-2" />,
  ADMIN: <ShieldCheck className="h-4 w-4 text-green-500 ml-2" />,
};

export const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  const fetchUsers = async (query: string) => {
    setIsLoading(true);
    setError("");

    try {
      if (!server?.id) return;

      const response = await axios.get<SearchUser[]>(`/api/users/search`, {
        params: {
          query,
          serverId: server.id
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInviteModalOpen) {
      fetchUsers('');
    }
  }, [isInviteModalOpen]);

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) return;

    setIsAddingMembers(true);
    console.log("Adding members:", selectedUserIds); // Debug log

    try {
      // Make sure we have the correct server.id
      if (!server?.id) {
        console.error("No server ID available");
        return;
      }

      console.log("Server ID:", server.id); // Debug log
      const result = await addMembers(server.id, selectedUserIds);
      console.log("Add members result:", result); // Debug log

      if (result.success) {
        setSelectedUserIds([]);
        setSearchResults([]);
        setSearchQuery("");
        setIsInviteModalOpen(false);
        router.refresh();
      } else {
        console.error("Error adding members:", result.error);
        // Maybe add some user feedback here
        setError(result.error || "Failed to add members");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      setError("Failed to add members");
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const result = await removeMember(server.id, memberId);
    if (result.success) {
      router.refresh();
    } else {
      console.error("Error removing member:", result.error);
    }
  };

  const toggleMember = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  const onRoleChange = async (memberId: string, newRole: MemberRole) => {
    try {
      const url = `/api/members/${memberId}/role`;
      await axios.patch(url, { role: newRole });
      router.refresh();
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold text-zinc-200">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4">
            <Button
              variant="outline"
              className="w-full text-zinc-200 bg-zinc-700/50 hover:bg-zinc-700 hover:text-zinc-100 border-0 transition-colors"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              Add Members
            </Button>
          </div>

          <ScrollArea className="mt-4 max-h-[420px] mx-6 mb-6 bg-black/10 rounded-md p-4">
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6 last:mb-0">
                <UserAvatar src={member.profile.imageUrl || ""} />
                <div className="flex gap-y-1 flex-col">
                  <div className="text-xs font-semibold flex items-center text-white">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">
                      {member.profile.email}
                    </p>
                  </div>
                </div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "GUEST")
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "MODERATOR")
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator></DropdownMenuSeparator>
                          <DropdownMenuItem onClick={() => handleRemoveMember(member.profileId)}>
                            <Gavel className="h-4 w-4 mr-2" />
                            Remove from server
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin text-zinc-400 ml-auto h-4 w-4" />
                )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Nested Add Members Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold text-zinc-200">
              Add Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Search and select members to add to the server
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Search className="h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchUsers(e.target.value);
                }}
                className="bg-zinc-700/50 border-0 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0"
              />
            </div>
            <ScrollArea className="h-[300px] bg-black/10 rounded-md">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center p-4 text-zinc-400">
                    {error}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="flex items-center justify-center p-4 text-zinc-400">
                    {searchQuery ? "No users found" : "Type to search users"}
                  </div>
                ) : (
                  <div className="pr-4">
                    {searchResults.map((user: SearchUser) => (
                      <div key={user.id} className="flex items-center space-x-4 py-3 px-2 hover:bg-zinc-700/50 rounded-lg transition">
                        <Checkbox
                          id={`member-${user.id}`}
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => toggleMember(user.id)}
                        />
                        <UserAvatar src={user.imageUrl} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-zinc-200">
                            {user.name}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {user.email}
                          </p>
                        </div>
                        {selectedUserIds.includes(user.id) && (
                          <Check className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleAddMembers}
                disabled={selectedUserIds.length === 0 || isAddingMembers}
                className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                {isAddingMembers ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Selected ({selectedUserIds.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
