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
  fallbackSrc = "/default-avatar.png"
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if current src is not already the fallback
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full",
          className
        )}
        style={{ width, height }}
      >
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error state with icon
  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full",
          className
        )}
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
      className={cn("rounded-full object-cover", className)}
      priority={priority}
      onLoad={handleLoad}
      onError={handleError}
      // Add timeout handling via loading strategy
      loading={priority ? "eager" : "lazy"}
      // Optimize for UploadThing images
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Eve5P4HcLtH/Z"
    />
  );
}; 