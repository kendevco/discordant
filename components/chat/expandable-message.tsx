"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpandableMessageProps {
  content: string;
  maxLength?: number;
  className?: string;
}

export const ExpandableMessage = ({ 
  content, 
  maxLength = 650,
  className = "" 
}: ExpandableMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If content is short enough, just display it normally
  if (content.length <= maxLength) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Find a good place to truncate (try to break at sentence or paragraph)
  const findTruncatePoint = (text: string, maxLen: number): number => {
    if (text.length <= maxLen) return text.length;
    
    // Try to break at paragraph
    const paragraphBreak = text.lastIndexOf('\n\n', maxLen);
    if (paragraphBreak > maxLen * 0.7) return paragraphBreak;
    
    // Try to break at sentence
    const sentenceBreak = text.lastIndexOf('. ', maxLen);
    if (sentenceBreak > maxLen * 0.7) return sentenceBreak + 1;
    
    // Try to break at line
    const lineBreak = text.lastIndexOf('\n', maxLen);
    if (lineBreak > maxLen * 0.8) return lineBreak;
    
    // Try to break at word
    const wordBreak = text.lastIndexOf(' ', maxLen);
    if (wordBreak > maxLen * 0.8) return wordBreak;
    
    // Fallback to exact length
    return maxLen;
  };

  const truncatePoint = findTruncatePoint(content, maxLength);
  const truncatedContent = content.substring(0, truncatePoint);
  const remainingContent = content.substring(truncatePoint);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: truncatedContent }} />
      
      {!isExpanded && (
        <div className="mt-2">
          <Button
            onClick={() => setIsExpanded(true)}
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Show More ({Math.ceil(remainingContent.length / 100)} more lines)
          </Button>
        </div>
      )}
      
      {isExpanded && (
        <>
          <div dangerouslySetInnerHTML={{ __html: remainingContent }} />
          <div className="mt-2">
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </Button>
          </div>
        </>
      )}
    </div>
  );
}; 