import { useQuery } from "@tanstack/react-query";
import { ServerWithMembersWithProfiles } from "@/types";

async function getServer(serverId: string) {
  if (!serverId) return null;
  
  const response = await fetch(`/api/servers/${serverId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch server");
  }
  return response.json();
}

export function useCurrentServer(serverId: string) {
  const { data: server, isLoading, error } = useQuery<ServerWithMembersWithProfiles>({
    queryKey: ["server", serverId],
    queryFn: () => getServer(serverId),
    enabled: !!serverId,
  });

  return {
    server,
    isLoading,
    error,
  };
} 