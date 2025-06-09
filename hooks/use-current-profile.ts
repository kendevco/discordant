import { useAuth } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { useEffect, useState } from "react";

export const useCurrentProfile = (): Profile | null => {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (userId) {
      // In a real implementation, you'd fetch from your API
      // For now, return a mock profile structure
      setProfile({
        id: userId,
        userId: userId,
        name: "Current User", // This would come from Clerk
        imageUrl: null,
        email: "user@example.com", // This would come from Clerk
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      setProfile(null);
    }
  }, [userId]);

  return profile;
}; 