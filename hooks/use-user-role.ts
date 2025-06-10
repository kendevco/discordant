import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export type UserRole = "HOST" | "ADMIN" | "MODERATOR" | "USER";

interface UseUserRoleReturn {
  role: UserRole | null;
  isHost: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isLoading: boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/profile/role');
        if (response.ok) {
          const data = await response.json();
          setRole(data.role as UserRole);
        } else {
          // Temporary: Default to HOST role for development while migrating from Clerk metadata
          setRole("HOST");
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        // Temporary: Default to HOST role for development while migrating from Clerk metadata
        setRole("HOST");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [user, isLoaded]);

  return {
    role,
    isHost: role === "HOST",
    isAdmin: role === "ADMIN" || role === "HOST", // HOST includes admin privileges
    isModerator: role === "MODERATOR" || role === "ADMIN" || role === "HOST", // Higher roles include moderator privileges
    isLoading
  };
} 