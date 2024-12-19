import { useQuery } from "@tanstack/react-query";
import { ServerWithMembersWithProfiles } from "@/types";

async function getServers() {
  const response = await fetch("/api/servers");
  if (!response.ok) {
    throw new Error("Failed to fetch servers");
  }
  return response.json();
}

export function useServers() {
  const { data: servers, isLoading, error } = useQuery<ServerWithMembersWithProfiles[]>({
    queryKey: ["servers"],
    queryFn: getServers,
  });

  return {
    servers: servers || [],
    isLoading,
    error,
  };
} 