"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageDialog = ({ isOpen, onClose, imageUrl }: ImageDialogProps) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-4xl w-full h-[80vh] p-0 border-none",
          "bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]"
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative w-full h-full overflow-hidden">
          <div
            className={cn(
              "absolute left-1/2 top-1/2 cursor-move transition-none",
              isDragging && "transition-none"
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          >
            <Image
              src={imageUrl}
              alt="Enlarged view"
              className="object-contain max-h-[80vh]"
              width={1200}
              height={800}
              quality={100}
              onDoubleClick={handleDoubleClick}
              draggable={false}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-md text-sm">
            {Math.round(scale * 100)}% (Scroll to zoom, drag to pan, double-click to reset)
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 