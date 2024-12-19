'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useNavigationStore } from '@/hooks/use-navigation-store';

export const NavigationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const setServerId = useNavigationStore(state => state.setServerId);

  useEffect(() => {
    setServerId(params?.serverId as string || null);
  }, [params?.serverId, setServerId]);

  return children;
}; 