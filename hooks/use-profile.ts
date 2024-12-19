'use client';

import { useQuery } from '@tanstack/react-query';

export const useProfile = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
  });

  return {
    profile,
    isLoading,
  };
}; 