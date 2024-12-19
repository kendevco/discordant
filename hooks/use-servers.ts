import { useQuery } from "@tanstack/react-query";
import type { ServerWithMembersWithProfiles } from "@/types/server";

async function fetchServers() {
  const response = await fetch("/api/servers");
  if (!response.ok) {
    throw new Error("Failed to fetch servers");
  }
  return response.json() as Promise<ServerWithMembersWithProfiles[]>;
}

export function useServers() {
  const { data, isLoading, error } = useQuery<ServerWithMembersWithProfiles[]>({
    queryKey: ["servers"],
    queryFn: fetchServers,
  });

  return {
    servers: data || [],
    isLoading,
    error: error as Error | null,
  };
} 