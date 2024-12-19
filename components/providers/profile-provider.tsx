'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Profile {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  // Add other profile fields as needed
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  isLoading: false,
  error: null,
});

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
  });

  return (
    <ProfileContext.Provider
      value={{
        profile: profile || null,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}; 