"use client";

import { Fragment } from "react";
import { ExpandableMessage } from "./expandable-message";
import { UI_CONFIG } from "@/lib/constants/ui-config";

interface RichContentRendererProps {
  content: string;
  isSystemMessage?: boolean;
}

export const RichContentRenderer = ({ 
  content, 
  isSystemMessage = false 
}: RichContentRendererProps) => {
  
  // If content is short enough, render normally with existing logic
  if (content.length <= UI_CONFIG.MESSAGE_EXPANDABLE_LENGTH) {
    if (isSystemMessage) {
      return (
        <div className="system-message">
          {renderSystemMessage(content)}
        </div>
      );
    }

    return (
      <div className="regular-message">
        {renderRegularMessage(content)}
      </div>
    );
  }

  // For long content, use ExpandableMessage with proper markdown-to-React conversion
  const formatContentForHTML = (text: string): string => {
    // Clean the text first - remove any existing HTML that might have been mistakenly added
    let cleanedText = text
      // Remove malformed HTML attributes that shouldn't be there
      .replace(/"\s+target="_blank"\s+rel="noopener noreferrer"\s+class="[^"]*"/g, '')
      .replace(/target="_blank"[^>]*>/g, '')
      .replace(/class="[^"]*"\s*>/g, '')
      .replace(/rel="[^"]*"\s*>/g, '');
    
    // Now apply proper markdown to HTML conversion
    return cleanedText
      // Handle markdown links FIRST (most important for the bug fix)
      .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '<strong><a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a></strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
      // Handle section headers (### Header or ## Header) - BEFORE other formatting
      .replace(/^###\s*(.+)$/gm, '<h3 class="text-lg font-bold text-blue-400 dark:text-blue-300 mt-1 mb-1">$1</h3>')
      .replace(/^##\s*(.+)$/gm, '<h2 class="text-xl font-bold text-blue-400 dark:text-blue-300 mt-1 mb-1">$1</h2>')
      .replace(/^#\s*(.+)$/gm, '<h1 class="text-2xl font-bold text-blue-400 dark:text-blue-300 mt-1 mb-1">$1</h1>')
      // Apply text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-200">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-zinc-800 dark:bg-zinc-700 px-1 py-0.5 rounded text-sm font-mono text-yellow-300">$1</code>')
      // Handle list items with bullet points
      .replace(/^[\s]*[-•]\s*(.+)$/gm, '<div class="ml-4 mb-0.5 text-zinc-200 dark:text-zinc-300">• $1</div>')
      // Handle numbered lists
      .replace(/^[\s]*(\d+)\.\s*(.+)$/gm, '<div class="ml-4 mb-0.5 text-zinc-200 dark:text-zinc-300">$1. $2</div>')
      // Handle plain URLs that aren't already in markdown links
      .replace(/(^|[^"])https?:\/\/[^\s<)]+(?![^<]*<\/a>)/g, '$1<a href="$&" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$&</a>')
      // Handle line breaks - much tighter spacing
      .replace(/\n\n+/g, '<br class="my-0.5">')
      .replace(/\n/g, '<br>');
  };

  if (isSystemMessage) {
    return (
      <ExpandableMessage 
        content={formatContentForHTML(content)}
        maxLength={UI_CONFIG.MESSAGE_EXPANDABLE_LENGTH}
        className="system-message text-zinc-200 dark:text-zinc-300"
      />
    );
  }

  return (
    <ExpandableMessage 
      content={formatContentForHTML(content)}
      maxLength={UI_CONFIG.MESSAGE_EXPANDABLE_LENGTH}
      className="regular-message text-zinc-600 dark:text-zinc-300"
    />
  );

  function renderSystemMessage(text: string) {
    // Enhanced rendering for system messages (research results, calendar responses, etc.)
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Markdown headers (### Header)
      if (line.match(/^#{1,3}\s+/)) {
        const level = line.match(/^(#{1,3})/)?.[1].length || 3;
        const headerText = line.replace(/^#{1,3}\s+/, '');
        const headerClass = level === 1 ? "text-xl font-bold mt-1 mb-1" :
                           level === 2 ? "text-lg font-bold mt-1 mb-1" :
                           "text-base font-bold mt-1 mb-0.5";
        return (
          <div key={index} className={`${headerClass} text-blue-400 dark:text-blue-300`}>
            {headerText}
          </div>
        );
      }
      
      // Headers with emojis (🔍 **Research Results:**)
      if (line.match(/^[🔍📋✅🔄❌🕐📅📊📄📍🌐❓⚠️💰🚀]\s?\*\*.*\*\*:?\s*$/)) {
        return (
          <div key={index} className="font-bold text-lg mb-1 mt-1 text-blue-400 dark:text-blue-300">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      // Sub-headers or important lines
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-base mb-0.5 text-green-400 dark:text-green-300">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      // Numbered list items (1. Item)
      if (line.match(/^\d+\.\s+/)) {
        return (
          <div key={index} className="ml-4 mb-0.5 text-zinc-200 dark:text-zinc-300">
            {renderFormattedLine(line)}
          </div>
        );
      }
      
      // Bullet points or list items with dashes/bullets
      if (line.match(/^[\s]*[-•]\s+/) || line.match(/^[📊📄📍🌐❌✅]\s/)) {
        return (
          <div key={index} className="ml-4 mb-0.5 text-zinc-300 dark:text-zinc-400">
            {renderFormattedLine(line)}
          </div>
        );
      }
      
      // Empty lines for minimal spacing
      if (line.trim() === '') {
        return <div key={index} className="h-0.5" />;
      }
      
      // Regular lines with very tight spacing
      return (
        <div key={index} className="mb-0.5 text-zinc-200 dark:text-zinc-300">
          {renderFormattedLine(line)}
        </div>
      );
    });
  }
    
  function renderFormattedLine(line: string): React.ReactNode {
    // Clean up any malformed HTML that might come from processing
    let cleanedLine = line
      // Remove any HTML attributes and tags that shouldn't be there
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '[$2]($1)')
      .replace(/"\s*target="_blank"[^>]*>/g, '')
      .replace(/"\s*class="[^"]*"/g, '')
      .replace(/"\s*rel="[^"]*"/g, '')
      // Fix malformed anchor patterns like: url" target="_blank"...>text
      .replace(/(https?:\/\/[^\s"]+)"\s+[^>]*>([^<\s]+(?:\s+[^<]*)?)/g, '[$2]($1)');
    
    // Parse markdown and other elements in sequence
    const elements: React.ReactNode[] = [];
    let remainingText = cleanedLine;
    let elementIndex = 0;
    
    // Process the line character by character to find markdown links
    while (remainingText.length > 0) {
      // Look for markdown links [text](url)
      const markdownMatch = remainingText.match(/\[([^\]]+)\]\(([^)]+)\)/);
      
      if (markdownMatch && markdownMatch.index !== undefined) {
        // Add text before the markdown link
        if (markdownMatch.index > 0) {
          const beforeText = remainingText.substring(0, markdownMatch.index);
          elements.push(
            <Fragment key={elementIndex++}>
              {processTextFormatting(beforeText)}
            </Fragment>
          );
        }
        
        // Add the markdown link
        elements.push(
          <a
            key={elementIndex++}
            href={markdownMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            {markdownMatch[1]}
          </a>
        );
        
        // Continue with remaining text
        remainingText = remainingText.substring(markdownMatch.index + markdownMatch[0].length);
      } else {
        // No more markdown links, process remaining text
        elements.push(
          <Fragment key={elementIndex++}>
            {processTextFormatting(remainingText)}
          </Fragment>
        );
        break;
      }
    }
    
    return elements.length > 1 ? elements : elements[0] || null;
  }
  
  function processTextFormatting(text: string): React.ReactNode {
    // Handle plain URLs first
    const urlRegex = /(https?:\/\/[^\s)+]+)/g;
    const urlParts = text.split(urlRegex);
    
    return urlParts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            {part}
          </a>
        );
      }
      
      // Apply text formatting to non-URL parts
      return <Fragment key={i}>{applyTextFormatting(part)}</Fragment>;
    });
  }
    
  function applyTextFormatting(text: string): React.ReactNode {
    let result: React.ReactNode = text;
    
    // Bold text (**text**)
    if (text.includes('**')) {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const boldParts = text.split(boldRegex);
      result = boldParts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-bold text-white">{part}</strong>;
        }
        return part;
      });
    }
    
    // If we have an array from bold processing, handle each part
    if (Array.isArray(result)) {
      return result.map((node, i) => {
        if (typeof node === 'string') {
          return <Fragment key={i}>{applyItalicAndCode(node)}</Fragment>;
        }
        return node;
      });
    }
    
    return applyItalicAndCode(result as string);
  }

  function applyItalicAndCode(text: string): React.ReactNode {
    let result: React.ReactNode = text;
    
    // Code text (`text`) - handle first to avoid conflicts
    if (text.includes('`')) {
      const codeRegex = /`(.*?)`/g;
      const codeParts = text.split(codeRegex);
      result = codeParts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <code 
              key={i} 
              className="bg-zinc-800 dark:bg-zinc-700 px-1 py-0.5 rounded text-sm font-mono text-yellow-300"
            >
              {part}
            </code>
          );
        }
        return part;
      });
    }
    
    // If we have an array from code processing, handle each text part for italics
    if (Array.isArray(result)) {
      return result.map((node, i) => {
        if (typeof node === 'string') {
          // Italic text (*text*) - only single asterisks, not double
          if (node.includes('*') && !node.includes('**')) {
            const italicRegex = /\*(.*?)\*/g;
            const italicParts = node.split(italicRegex);
            return italicParts.map((italicPart, j) => {
              if (j % 2 === 1) {
                return <em key={`${i}-${j}`} className="italic text-zinc-200">{italicPart}</em>;
              }
              return italicPart;
            });
          }
          return node;
        }
        return node;
      });
    }
    
    // Single string italic processing
    if (typeof result === 'string' && result.includes('*') && !result.includes('**')) {
      const italicRegex = /\*(.*?)\*/g;
      const italicParts = result.split(italicRegex);
      return italicParts.map((part, i) => {
        if (i % 2 === 1) {
          return <em key={i} className="italic text-zinc-200">{part}</em>;
        }
        return part;
      });
    }
    
    return result;
  }

  function renderRegularMessage(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all transition-colors"
          >
            {part}
          </a>
        );
      }
      
      // Handle line breaks and formatting for regular text
      return part.split('\n').map((line, j) => {
        return (
          <Fragment key={`${i}-${j}`}>
            {renderFormattedLine(line)}
            {j !== part.split('\n').length - 1 && <br />}
          </Fragment>
        );
      });
    });
  }
}; 