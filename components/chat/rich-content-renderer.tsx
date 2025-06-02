"use client";

import { Fragment } from "react";
import { ExpandableMessage } from "./expandable-message";

interface RichContentRendererProps {
  content: string;
  isSystemMessage?: boolean;
}

export const RichContentRenderer = ({ 
  content, 
  isSystemMessage = false 
}: RichContentRendererProps) => {
  
  // If content is short enough, render normally with existing logic
  if (content.length <= 650) {
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

  // For long content, use ExpandableMessage with a simpler HTML formatter
  const formatContentForHTML = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Clean up markdown formatting around URLs first (fix the Google Calendar link issue)
      .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline break-all transition-colors">$1</a>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline break-all transition-colors">$1</a>')
      // Clean up stray ** around URLs but be more careful
      .replace(/\*\*(https?:\/\/[^\s*]+)\*\*/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline break-all transition-colors">$1</a>')
      // Apply basic formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-200">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-zinc-800 dark:bg-zinc-700 px-1 py-0.5 rounded text-sm font-mono text-yellow-300">$1</code>')
      // Handle remaining plain URLs
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline break-all transition-colors">$1</a>')
      // Handle line breaks last
      .replace(/\n/g, '<br />');
  };

  if (isSystemMessage) {
    return (
      <ExpandableMessage 
        content={formatContentForHTML(content)}
        maxLength={650}
        className="system-message text-zinc-200 dark:text-zinc-300"
      />
    );
  }

  return (
    <ExpandableMessage 
      content={formatContentForHTML(content)}
      maxLength={650}
      className="regular-message text-zinc-600 dark:text-zinc-300"
    />
  );

  function renderSystemMessage(text: string) {
    // Enhanced rendering for system messages (research results, calendar responses, etc.)
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Headers with emojis (🔍 **Research Results:**)
      if (line.match(/^[🔍📋✅🔄❌🕐📅📊📄📍🌐❓⚠️]\s?\*\*.*\*\*:?\s*$/)) {
        return (
          <div key={index} className="font-bold text-lg mb-2 text-blue-400 dark:text-blue-300">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      // Sub-headers or important lines
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-base mb-1 text-green-400 dark:text-green-300">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      // Bullet points or list items
      if (line.match(/^[📊📄📍🌐❌✅]\s/)) {
        return (
          <div key={index} className="ml-4 mb-1 text-zinc-300 dark:text-zinc-400">
            {renderFormattedLine(line)}
          </div>
        );
      }
      
      // Empty lines for spacing
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      
      // Regular lines
      return (
        <div key={index} className="mb-1 text-zinc-200 dark:text-zinc-300">
          {renderFormattedLine(line)}
        </div>
      );
    });
  }
    
  function renderFormattedLine(line: string): React.ReactNode {
    // First clean up markdown formatting around URLs to fix Google Calendar link issues
    let cleanedLine = line
      // Remove ** formatting around URLs
      .replace(/\*\*(https?:\/\/[^\s*]+)\*\*/g, '$1')
      // Handle markdown links [text](url) wrapped in **
      .replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, '[$1]($2)')
      // Clean up any trailing ** after URLs
      .replace(/(https?:\/\/[^\s]+)\*\*/g, '$1');
    
    // Process markdown links first [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let processedLine = cleanedLine.replace(markdownLinkRegex, (match, text, url) => {
      return `__MARKDOWN_LINK_START__${text}__MARKDOWN_LINK_MID__${url}__MARKDOWN_LINK_END__`;
    });
    
    // Process URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlParts = processedLine.split(urlRegex);

    return urlParts.map((part, i) => {
      // Handle processed markdown links
      if (part.includes('__MARKDOWN_LINK_START__')) {
        const linkMatch = part.match(/__MARKDOWN_LINK_START__([^_]+)__MARKDOWN_LINK_MID__([^_]+)__MARKDOWN_LINK_END__/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline break-all transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        }
      }
      
      // Handle plain URLs
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
      
      // Apply text formatting to regular text parts
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