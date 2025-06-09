import { Message, DirectMessage, MessageRole, AIContentCategory } from "@prisma/client";
import { MessageWithMemberWithProfile } from "@/lib/system/types/message";

export interface AIDetectionResult {
  isAIGenerated: boolean;
  category: AIContentCategory;
  confidenceScore: number;
  sourceUrl?: string;
  processingIndicators: string[];
}

/**
 * Detect if a message is AI-generated based on content and metadata
 */
export const detectAIContent = (message: Message | DirectMessage, memberProfile?: { name: string }): AIDetectionResult => {
  const indicators: string[] = [];
  let confidenceScore = 0;
  let category: AIContentCategory = AIContentCategory.GENERAL_AI_RESPONSE;

  // Check role - system messages are likely AI
  if ('role' in message && message.role === MessageRole.system) {
    indicators.push("System message role");
    confidenceScore += 0.4;
  }

  // Check if message is from system user
  if (memberProfile?.name && (
    memberProfile.name.toLowerCase().includes('system') || 
    memberProfile.name.toLowerCase().includes('bot') ||
    memberProfile.name.toLowerCase().includes('ai')
  )) {
    indicators.push("System/Bot user profile");
    confidenceScore += 0.5;
  }

  // Content pattern analysis
  const content = message.content;
  const aiPatterns = [
    /\*\*(Analysis|Summary|Findings|Insights|Research|Report):\*\*/i,
    /AI Analysis:/i,
    /Research Summary:/i,
    /Based on my analysis/i,
    /According to the document/i,
    /Key findings include/i,
    /Executive Summary/i,
    /🤖|🔍|📊|📄|💼|⚙️|📈|🎯|✅|❌|🔄|🕐|📅/,
    /## (Summary|Analysis|Findings|Key Points|Insights)/i,
    /\*\*Key (Insights|Findings|Points|Recommendations)\*\*/i,
    /I've sent the email/i,
    /email to .+@.+\./i,
    /workflow for emailing/i,
    /letting him know it was sent by n8n/i,
    /check out the update/i,
    /if you need to set up a workflow/i,
    /NRG GSA Report/i,
    /DUTY OFFICER/i,
    /Research Results/i
  ];

  for (const pattern of aiPatterns) {
    if (pattern.test(content)) {
      indicators.push(`Content pattern: ${pattern.source}`);
      confidenceScore += 0.15;
    }
  }

  // Categorize based on content
  category = categorizeAIContent(content);
  
  // Structure indicators
  if (content.includes('**') && content.includes('##')) {
    indicators.push("Structured markdown formatting");
    confidenceScore += 0.1;
  }

  // Length and complexity indicators
  if (content.length > 500 && content.split('\n').length > 5) {
    indicators.push("Long-form structured content");
    confidenceScore += 0.1;
  }

  // URL extraction for source
  const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
  const sourceUrl = urlMatch ? urlMatch[0] : undefined;

  return {
    isAIGenerated: confidenceScore > 0.3,
    category,
    confidenceScore: Math.min(confidenceScore, 1.0),
    sourceUrl,
    processingIndicators: indicators
  };
};

/**
 * Categorize AI content based on patterns and keywords
 */
export const categorizeAIContent = (content: string): AIContentCategory => {
  const lowerContent = content.toLowerCase();

  // Research and analysis patterns
  if (lowerContent.includes('research') || lowerContent.includes('study') || lowerContent.includes('findings')) {
    return AIContentCategory.RESEARCH_REPORT;
  }

  // Document analysis patterns
  if (lowerContent.includes('document') || lowerContent.includes('pdf') || lowerContent.includes('file analysis')) {
    return AIContentCategory.DOCUMENT_ANALYSIS;
  }

  // Business intelligence patterns
  if (lowerContent.includes('business') || lowerContent.includes('revenue') || lowerContent.includes('market')) {
    return AIContentCategory.BUSINESS_INTELLIGENCE;
  }

  // Technical analysis patterns
  if (lowerContent.includes('code') || lowerContent.includes('technical') || lowerContent.includes('api')) {
    return AIContentCategory.TECHNICAL_ANALYSIS;
  }

  // Market insights patterns
  if (lowerContent.includes('trend') || lowerContent.includes('forecast') || lowerContent.includes('growth')) {
    return AIContentCategory.MARKET_INSIGHTS;
  }

  // Data visualization patterns
  if (lowerContent.includes('chart') || lowerContent.includes('graph') || lowerContent.includes('visualization')) {
    return AIContentCategory.DATA_VISUALIZATION;
  }

  // Meeting summary patterns
  if (lowerContent.includes('meeting') || lowerContent.includes('discussion') || lowerContent.includes('agenda')) {
    return AIContentCategory.MEETING_SUMMARY;
  }

  // Code analysis patterns
  if (lowerContent.includes('function') || lowerContent.includes('class') || lowerContent.includes('algorithm')) {
    return AIContentCategory.CODE_ANALYSIS;
  }

  return AIContentCategory.GENERAL_AI_RESPONSE;
};

/**
 * Get user-friendly label for AI content category
 */
export const getAIContentTypeLabel = (category: AIContentCategory): string => {
  const labels: Record<AIContentCategory, string> = {
    [AIContentCategory.RESEARCH_REPORT]: "📊 Research Report",
    [AIContentCategory.DOCUMENT_ANALYSIS]: "📄 Document Analysis",
    [AIContentCategory.BUSINESS_INTELLIGENCE]: "💼 Business Intelligence",
    [AIContentCategory.TECHNICAL_ANALYSIS]: "⚙️ Technical Analysis",
    [AIContentCategory.MARKET_INSIGHTS]: "📈 Market Insights",
    [AIContentCategory.DATA_VISUALIZATION]: "📊 Data Visualization",
    [AIContentCategory.AI_RECOMMENDATION]: "🎯 AI Recommendation",
    [AIContentCategory.CODE_ANALYSIS]: "💻 Code Analysis",
    [AIContentCategory.MEETING_SUMMARY]: "📝 Meeting Summary",
    [AIContentCategory.GENERAL_AI_RESPONSE]: "🤖 AI Response"
  };

  return labels[category] || "🤖 AI Response";
};

/**
 * Extract URLs from content
 */
export const extractUrls = (content: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.match(urlRegex) || [];
};

/**
 * Generate a shareable title from message content
 */
export const generateShareTitle = (content: string, category: AIContentCategory): string => {
  const lines = content.split('\n').filter(line => line.trim());
  
  // Try to find a header or title
  for (const line of lines) {
    const headerMatch = line.match(/^#+\s*(.+)$/);
    if (headerMatch) {
      return headerMatch[1].trim();
    }
    
    const boldMatch = line.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch[1].length < 100) {
      return boldMatch[1].trim();
    }
  }

  // Fallback to category-based title with content preview
  const preview = content.substring(0, 60).trim();
  const categoryLabel = getAIContentTypeLabel(category).replace(/[📊📄💼⚙️📈🎯💻📝🤖]\s*/, '');
  
  return `${categoryLabel}: ${preview}${content.length > 60 ? '...' : ''}`;
}; 