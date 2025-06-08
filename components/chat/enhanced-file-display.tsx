"use client";

import { useState, useEffect } from "react";
import { FileIcon, ExternalLink, Eye, Brain, MapPin, Tag, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { FileProcessingService } from "@/lib/services/file-processing";

interface FileMetadata {
  id: string;
  originalUrl: string;
  fileName?: string | null;
  fileType: string;
  processingStatus: string;
  extractedText?: string | null;
  description?: string | null;
  tags?: string | null;
  location?: string | null;
  businessContext?: string | null;
  aiSummary?: string | null;
  aiCategories?: string | null;
  businessEntities?: string | null;
  actionItems?: string | null;
  externalLinks?: string | null;
  googleDocsUrl?: string | null;
  sharePointUrl?: string | null;
  confluenceUrl?: string | null;
  ocrCompleted: boolean;
  aiAnalyzed: boolean;
  lastProcessed?: Date | null;
  createdAt: Date;
}

interface EnhancedFileDisplayProps {
  fileUrl: string;
  messageId?: string;
  directMessageId?: string;
  originalContent?: string;
  isImage?: boolean;
  isPdf?: boolean;
}

export const EnhancedFileDisplay = ({
  fileUrl,
  messageId,
  directMessageId,
  originalContent,
  isImage,
  isPdf,
}: EnhancedFileDisplayProps) => {
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const data = await FileProcessingService.getFileMetadata(messageId, directMessageId);
        setMetadata(data);
      } catch (err) {
        console.error("Error fetching file metadata:", err);
        setError("Failed to load file metadata");
      } finally {
        setLoading(false);
      }
    };

    if (messageId || directMessageId) {
      fetchMetadata();
    } else {
      setLoading(false);
    }
  }, [messageId, directMessageId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const parseJsonField = (field?: string | null) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const parseLocationField = (field?: string | null) => {
    if (!field) return null;
    try {
      return JSON.parse(field);
    } catch {
      return null;
    }
  };

  // Basic file display (always shown)
  const renderBasicFile = () => {
    if (isImage && !isPdf) {
      return (
        <div className="relative w-80 h-80 mb-4">
          <Image
            fill
            src={fileUrl}
            alt="Uploaded image"
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="relative flex items-center p-2 mb-4 rounded-md bg-background/10">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm ml-2 text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            PDF File
          </a>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {renderBasicFile()}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 animate-spin" />
          <span>Processing file...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        {renderBasicFile()}
        <div className="flex items-center space-x-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return renderBasicFile();
  }

  const tags = parseJsonField(metadata.tags);
  const categories = parseJsonField(metadata.aiCategories);
  const entities = parseJsonField(metadata.businessEntities);
  const actionItems = parseJsonField(metadata.actionItems);
  const externalLinks = parseJsonField(metadata.externalLinks);
  const location = parseLocationField(metadata.location);

  return (
    <div className="space-y-4">
      {/* Basic file display */}
      {renderBasicFile()}

      {/* Enhanced metadata card */}
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              {getStatusIcon(metadata.processingStatus)}
              <span>File Analysis</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Quick summary */}
          {metadata.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {metadata.description}
            </p>
          )}

          {/* Tags and categories */}
          {(tags.length > 0 || categories.length > 0) && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.map((tag: string, index: number) => (
                <Badge key={`tag-${index}`} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {categories.map((category: string, index: number) => (
                <Badge key={`cat-${index}`} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* External links */}
          {externalLinks.length > 0 && (
            <div className="space-y-1 mb-3">
              {externalLinks.map((link: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {link.title}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Expandable details */}
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleContent className="space-y-3">
              <Separator />

              {/* AI Summary */}
              {metadata.aiSummary && (
                <div>
                  <h4 className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <Brain className="h-4 w-4" />
                    <span>AI Summary</span>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metadata.aiSummary}
                  </p>
                </div>
              )}

              {/* Business Context */}
              {metadata.businessContext && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Business Context</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metadata.businessContext}
                  </p>
                </div>
              )}

              {/* Location */}
              {location && (
                <div>
                  <h4 className="text-sm font-medium flex items-center space-x-1 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {location.address || location.businessName || 'Location detected'}
                  </p>
                </div>
              )}

              {/* Business Entities */}
              {entities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Detected Entities</h4>
                  <div className="flex flex-wrap gap-1">
                    {entities.map((entity: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {actionItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Action Items</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {actionItems.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Text Preview */}
              {metadata.extractedText && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Extracted Text</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    {metadata.extractedText.substring(0, 500)}
                    {metadata.extractedText.length > 500 && '...'}
                  </div>
                </div>
              )}

              {/* Processing Info */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                <div className="flex justify-between">
                  <span>OCR: {metadata.ocrCompleted ? '✓' : '✗'}</span>
                  <span>AI Analysis: {metadata.aiAnalyzed ? '✓' : '✗'}</span>
                  <span>
                    Processed: {metadata.lastProcessed ? 
                      new Date(metadata.lastProcessed).toLocaleString() : 
                      'Not processed'
                    }
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}; 