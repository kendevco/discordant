"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width = 96,
  height = 96,
  className,
  priority = false,
  fallbackSrc = "/default-avatar.png",
}: OptimizedImageProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setImageState('loaded');
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageState('loading');
    } else {
      setImageState('error');
    }
  };

  if (imageState === 'loading') {
    return (
      <div
        className={cn("flex items-center justify-center bg-gray-200 dark:bg-gray-700", className)}
        style={{ width, height }}
      >
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div
        className={cn("flex items-center justify-center bg-gray-200 dark:bg-gray-700", className)}
        style={{ width, height }}
      >
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
      priority={priority}
      onLoad={handleLoad}
      onError={handleError}
      quality={85}
    />
  );
}; 