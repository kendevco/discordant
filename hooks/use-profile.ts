'use client';

import { useUser } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/profile/${user.id}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchProfile();
    }
  }, [user?.id, isLoaded]);

  if (!isLoaded || isLoading) {
    return null;
  }

  return profile;
}; 