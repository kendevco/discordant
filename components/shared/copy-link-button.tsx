"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function CopyLinkButton() {
  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={copyCurrentUrl}
      variant="outline"
      size="sm"
      className="border-white/20 text-white hover:bg-white/10"
    >
      <Copy className="w-4 h-4 mr-2" />
      Share Link
    </Button>
  );
} 