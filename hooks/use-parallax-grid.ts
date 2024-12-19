'use client';

import { useEffect, useRef } from 'react';

export const useParallaxGrid = (sensitivity: number = 0.02) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const { clientX, clientY } = e;
      const { width, height } = gridRef.current.getBoundingClientRect();
      
      const xOffset = (clientX - width / 2) * sensitivity;
      const yOffset = (clientY - height / 2) * sensitivity;

      gridRef.current.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sensitivity]);

  return gridRef;
}; 