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



  // Find a better truncation point that doesn't break in the middle of HTML elements
  const findSafeTruncatePoint = (text: string, maxLen: number): number => {
    if (text.length <= maxLen) return text.length;
    
    let truncatePoint = maxLen;
    
    // Don't break in the middle of an HTML tag
    const tagOpenIndex = text.lastIndexOf('<', truncatePoint);
    const tagCloseIndex = text.lastIndexOf('>', truncatePoint);
    
    if (tagOpenIndex > tagCloseIndex) {
      // We're in the middle of a tag, go back to before the tag
      truncatePoint = tagOpenIndex;
    }
    
    // Try to break at a logical point
    const breakPoints = [
      text.lastIndexOf('</div>', truncatePoint),
      text.lastIndexOf('<br>', truncatePoint),
      text.lastIndexOf('</h3>', truncatePoint),
      text.lastIndexOf('</h2>', truncatePoint),
      text.lastIndexOf('. ', truncatePoint),
      text.lastIndexOf('\n', truncatePoint)
    ].filter(point => point > maxLen * 0.7);
    
    if (breakPoints.length > 0) {
      truncatePoint = Math.max(...breakPoints);
      // If we found a closing tag, include it
      if (text.substring(truncatePoint, truncatePoint + 6) === '</div>') {
        truncatePoint += 6;
      } else if (text.substring(truncatePoint, truncatePoint + 5) === '</h3>') {
        truncatePoint += 5;
      } else if (text.substring(truncatePoint, truncatePoint + 5) === '</h2>') {
        truncatePoint += 5;
      } else if (text.substring(truncatePoint, truncatePoint + 4) === '<br>') {
        truncatePoint += 4;
      }
    }
    
    return Math.max(truncatePoint, maxLen * 0.5); // Ensure we don't truncate too early
  };

  const truncatePoint = findSafeTruncatePoint(content, maxLength);
  const truncatedContent = content.substring(0, truncatePoint);
  const remainingContent = content.substring(truncatePoint);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: truncatedContent }} />
      
      {!isExpanded && remainingContent.length > 0 && (
        <div className="mt-3 pt-2 border-t border-zinc-700/50">
          <Button
            onClick={() => setIsExpanded(true)}
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Show More ({Math.ceil(remainingContent.replace(/<[^>]*>/g, '').length / 50)} more sections)
          </Button>
        </div>
      )}
      
      {isExpanded && (
        <>
          <div dangerouslySetInnerHTML={{ __html: remainingContent }} />
          <div className="mt-3 pt-2 border-t border-zinc-700/50">
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