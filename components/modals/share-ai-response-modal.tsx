"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Copy, 
  ExternalLink, 
  Loader2,
  CheckCircle,
  Link as LinkIcon
} from "lucide-react";
import { 
  detectAIContent, 
  generateShareTitle
} from "@/lib/utils/ai-detection";

export const ShareAIResponseModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const profile = useCurrentProfile();
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const isModalOpen = isOpen && type === "shareAIResponse";
  const message = data.message || data.directMessage;

  const generateShareLink = async () => {
    if (!message || !profile) return;

    setIsLoading(true);
    try {
      const detection = detectAIContent(message);
      const autoTitle = generateShareTitle(message.content, detection.category);

      const response = await axios.post("/api/messages/share", {
        messageId: data.message?.id,
        directMessageId: data.directMessage?.id,
        title: autoTitle,
        category: detection.category,
        isPublic: true,
        includeMetadata: false,
        enhanceForSharing: false,
        allowComments: false,
        sharedBy: profile.id,
      });

      const { shareId } = response.data;
      const generatedShareUrl = `${window.location.origin}/shared/${shareId}`;
      setShareUrl(generatedShareUrl);
      setShareSuccess(true);

      toast({
        title: "Share Link Created! 🔗",
        description: "Public link generated - no auth required",
      });
    } catch (error) {
      console.error("[SHARE_AI_RESPONSE]", error);
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied! 📋",
        description: "Share link copied to clipboard",
      });
    }
  };

  const handleClose = () => {
    setShareUrl("");
    setShareSuccess(false);
    onClose();
  };

  // Auto-generate link when modal opens
  useEffect(() => {
    if (isModalOpen && message && !shareSuccess && !isLoading) {
      generateShareLink();
    }
  }, [isModalOpen, message]);

  if (!message) return null;

  const contentPreview = message.content.length > 150 
    ? message.content.substring(0, 150) + "..." 
    : message.content;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden max-w-md">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-300" />
            Share AI Response
          </DialogTitle>
          <DialogDescription className="text-purple-200">
            Generate a public link that bypasses authentication
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Content Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-sm text-white/90 leading-relaxed">
              {contentPreview}
            </p>
            {message.fileUrl && (
              <div className="text-xs text-purple-300 mt-2">
                📎 Includes attachment
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-blue-300">Generating public link...</span>
              </div>
            </div>
          ) : shareSuccess ? (
            <div className="space-y-3">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Link Ready!</span>
                </div>
                <p className="text-xs text-green-200 mt-1">
                  Anyone with this link can view the content without logging in
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-medium text-purple-200">Public Share Link</span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={shareUrl}
                    readOnly 
                    className="bg-white/10 border-white/20 text-white font-mono text-xs"
                  />
                  <Button 
                    onClick={copyShareUrl}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 px-3"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button 
                    onClick={() => window.open(shareUrl, '_blank')}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-3"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  Done
                </Button>
                <Button 
                  onClick={() => {
                    setShareSuccess(false);
                    setShareUrl("");
                    generateShareLink();
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  New Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-300">Failed to generate link</span>
              </div>
              <Button 
                onClick={generateShareLink}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 