'use client';

import { useTheme } from 'next-themes';
import { cyberNoirTheme } from '@/lib/themes/cyber-noir';

export const useCyberTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? cyberNoirTheme.dark : cyberNoirTheme.light;

  const getStatusColor = (status: 'online' | 'idle' | 'offline') => {
    if (isDark) {
      return {
        online: '#00FF8C',
        idle: '#FFB800',
        offline: '#404040'
      }[status];
    }
    return {
      online: '#10B981',
      idle: '#EAB308',
      offline: '#6B7280'
    }[status];
  };

  const getStatusGlow = (status: 'online' | 'idle' | 'offline') => {
    if (status === 'offline') return '';
    
    const color = getStatusColor(status);
    return `0 0 8px ${color}`;
  };

  const getNeonGlow = (color: string = colors.accent, intensity: 'low' | 'medium' | 'high' = 'medium') => {
    const intensities = {
      low: [3, 6],
      medium: [5, 10],
      high: [8, 15]
    };
    
    const [inner, outer] = intensities[intensity];
    return `0 0 ${inner}px ${color}, 0 0 ${outer}px ${color}`;
  };

  return {
    isDark,
    colors,
    getStatusColor,
    getStatusGlow,
    getNeonGlow
  };
}; 