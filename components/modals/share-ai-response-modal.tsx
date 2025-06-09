"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Brain, 
  Copy, 
  ExternalLink, 
  Loader2,
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { 
  detectAIContent, 
  getAIContentTypeLabel, 
  generateShareTitle, 
  extractUrls 
} from "@/lib/utils/ai-detection";
import { AIContentCategory } from "@prisma/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  category: z.nativeEnum(AIContentCategory),
  sourceUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
  includeMetadata: z.boolean().default(false),
  enhanceForSharing: z.boolean().default(false),
  allowComments: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AIResponsePreviewProps {
  content: string;
  fileUrl?: string | null;
}

function AIResponsePreview({ content, fileUrl }: AIResponsePreviewProps) {
  const truncatedContent = content.length > 300 ? content.substring(0, 300) + "..." : content;
  
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {truncatedContent.split('\n').map((line, index) => (
          <div key={index} className={line.trim() ? "" : "h-2"}>
            {line.includes('**') ? (
              <span className="font-semibold">{line.replace(/\*\*/g, '')}</span>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
      {fileUrl && (
        <div className="text-xs text-blue-600 dark:text-blue-400">
          📎 Attachment: {fileUrl}
        </div>
      )}
    </div>
  );
}

export const ShareAIResponseModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const profile = useCurrentProfile();
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const isModalOpen = isOpen && type === "shareAIResponse";
  const message = data.message || data.directMessage;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: AIContentCategory.GENERAL_AI_RESPONSE,
      sourceUrl: "",
      isPublic: true,
      includeMetadata: false,
      enhanceForSharing: false,
      allowComments: false,
    },
  });

  // Auto-detect AI content and populate form
  useEffect(() => {
    if (message && isModalOpen) {
      const detection = detectAIContent(message);
      const extractedUrls = extractUrls(message.content);
      const autoTitle = generateShareTitle(message.content, detection.category);

      form.reset({
        title: autoTitle,
        description: `AI-generated ${getAIContentTypeLabel(detection.category).toLowerCase()} with ${(detection.confidenceScore * 100).toFixed(0)}% confidence`,
        category: detection.category,
        sourceUrl: extractedUrls[0] || "",
        isPublic: true,
        includeMetadata: detection.confidenceScore > 0.7,
        enhanceForSharing: detection.confidenceScore > 0.8,
        allowComments: false,
      });
    }
  }, [message, isModalOpen, form]);

  const onSubmit = async (values: FormValues) => {
    if (!message || !profile) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/api/messages/share", {
        messageId: data.message?.id,
        directMessageId: data.directMessage?.id,
        ...values,
        sharedBy: profile.id,
      });

      const { shareId } = response.data;
      const generatedShareUrl = `${window.location.origin}/shared/${shareId}`;
      setShareUrl(generatedShareUrl);
      setShareSuccess(true);

      toast({
        title: "AI Response Shared Successfully! 🤖",
        description: "Your AI analysis is now publicly accessible",
      });
    } catch (error) {
      console.error("[SHARE_AI_RESPONSE]", error);
      toast({
        title: "Error",
        description: "Failed to share AI response. Please try again.",
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
        description: "AI insights link copied to clipboard",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setShareUrl("");
    setShareSuccess(false);
    onClose();
  };

  if (!message) return null;

  const detection = detectAIContent(message);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-0 overflow-hidden max-w-2xl">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-300" />
            Share AI Analysis
          </DialogTitle>
          <DialogDescription className="text-purple-200">
            Make this AI response publicly accessible for reference and collaboration
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* AI Content Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">AI Generated Content</span>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                {(detection.confidenceScore * 100).toFixed(0)}% Confidence
              </Badge>
            </div>
            <AIResponsePreview 
              content={message.content} 
              fileUrl={message.fileUrl} 
            />
          </div>

          {shareSuccess ? (
            // Share Success View
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-green-300">Successfully Shared!</span>
                </div>
                <p className="text-sm text-green-200">
                  Your AI analysis is now publicly accessible at the link below.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-medium text-purple-200">AI Insights Link</span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={shareUrl}
                    readOnly 
                    className="bg-white/10 border-white/20 text-white font-mono text-sm"
                  />
                  <Button 
                    onClick={copyShareUrl}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => window.open(shareUrl, '_blank')}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => setShareSuccess(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Share Another
                </Button>
              </div>
            </div>
          ) : (
            // Share Configuration Form
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-200">Content Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={AIContentCategory.RESEARCH_REPORT}>📊 Research Report</SelectItem>
                            <SelectItem value={AIContentCategory.DOCUMENT_ANALYSIS}>📄 Document Analysis</SelectItem>
                            <SelectItem value={AIContentCategory.BUSINESS_INTELLIGENCE}>💼 Business Intelligence</SelectItem>
                            <SelectItem value={AIContentCategory.TECHNICAL_ANALYSIS}>⚙️ Technical Analysis</SelectItem>
                            <SelectItem value={AIContentCategory.MARKET_INSIGHTS}>📈 Market Insights</SelectItem>
                            <SelectItem value={AIContentCategory.CODE_ANALYSIS}>💻 Code Analysis</SelectItem>
                            <SelectItem value={AIContentCategory.MEETING_SUMMARY}>📝 Meeting Summary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sourceUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-200">Source URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Original source URL..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter a descriptive title..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-200">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of the AI analysis..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Enhancement Options */}
                <div className="space-y-3 bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-purple-200">Enhancement Options</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enhanceForSharing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-purple-200">
                              Generate executive summary
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includeMetadata"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-purple-200">
                              Include processing metadata
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="allowComments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-purple-200">
                            Allow public comments and discussions
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Share Link...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Share AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 