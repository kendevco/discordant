"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  Search,
  Calendar,
  Eye,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAIContentTypeLabel } from '@/lib/utils/ai-detection';
import { AIContentCategory } from '@prisma/client';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface SharedMessage {
  id: string;
  shareId: string;
  title: string;
  description?: string;
  category: AIContentCategory;
  viewCount: number;
  sharedAt: Date;
  confidenceScore?: number;
  sourceUrl?: string;
  isAIGenerated: boolean;
  message?: {
    content: string;
    fileUrl?: string;
    member: {
      profile: {
        name: string;
      };
    };
  };
  directMessage?: {
    content: string;
    fileUrl?: string;
    member: {
      profile: {
        name: string;
      };
    };
  };
}

interface AIContentFilters {
  search: string;
  category: AIContentCategory | 'all';
  sortBy: 'recent' | 'popular' | 'confidence';
}

function AIContentCard({ sharedMessage }: { sharedMessage: SharedMessage }) {
  const message = sharedMessage.message || sharedMessage.directMessage;
  const shareUrl = `${window.location.origin}/shared/${sharedMessage.shareId}`;
  
  const copyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied! 📋",
      description: "AI insights link copied to clipboard",
    });
  };

  const contentPreview = message?.content ? 
    message.content.substring(0, 200) + (message.content.length > 200 ? '...' : '') :
    'AI-generated content';

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6">
        {/* AI Badge and Stats */}
        <div className="flex items-center justify-between mb-3">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Bot className="w-3 h-3 mr-1" />
            AI Generated
          </Badge>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {sharedMessage.viewCount}
            </div>
            {sharedMessage.confidenceScore && (
              <Badge variant="outline" className="text-xs">
                {(sharedMessage.confidenceScore * 100).toFixed(0)}%
              </Badge>
            )}
          </div>
        </div>

        {/* Category Badge */}
        <Badge variant="secondary" className="mb-3">
          {getAIContentTypeLabel(sharedMessage.category)}
        </Badge>

        {/* Title and Description */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {sharedMessage.title}
        </h3>
        
        {sharedMessage.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {sharedMessage.description}
          </p>
        )}

        {/* Content Preview */}
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {contentPreview}
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(sharedMessage.sharedAt))} ago
            </div>
            {message?.member && (
              <span>by {message.member.profile.name}</span>
            )}
          </div>
          
          {/* Source URL if available */}
          {sharedMessage.sourceUrl && (
            <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
              Source: {new URL(sharedMessage.sourceUrl).hostname}
            </div>
          )}
          
          {/* File indicator */}
          {message?.fileUrl && (
            <div className="text-xs text-green-600 dark:text-green-400">
              📎 Contains attachment
            </div>
          )}
        </div>

        {/* Share Actions */}
        <div className="flex gap-2">
          <Link href={`/shared/${sharedMessage.shareId}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full text-sm group-hover:border-purple-300 group-hover:text-purple-600 transition-colors"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              View Analysis
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={copyShareUrl}
            className="px-3"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.open(shareUrl, '_blank')}
            className="px-3"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AIGalleryPage() {
  const [sharedMessages, setSharedMessages] = useState<SharedMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<SharedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AIContentFilters>({
    search: '',
    category: 'all',
    sortBy: 'recent',
  });

  // Fetch shared messages
  useEffect(() => {
    const fetchSharedMessages = async () => {
      try {
        const response = await fetch('/api/messages/shared');
        const data = await response.json();
        setSharedMessages(data);
        setFilteredMessages(data);
      } catch (error) {
        console.error('Failed to fetch shared messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedMessages();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...sharedMessages];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(message => 
        message.title.toLowerCase().includes(searchLower) ||
        message.description?.toLowerCase().includes(searchLower) ||
        (message.message?.content || message.directMessage?.content || '').toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(message => message.category === filters.category);
    }

    // Sort
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'confidence':
        filtered.sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0));
        break;
    }

    setFilteredMessages(filtered);
  }, [sharedMessages, filters]);

  const categoryOptions = [
    { value: 'all', label: '🔍 All AI Content', count: sharedMessages.length },
    { value: AIContentCategory.RESEARCH_REPORT, label: '📊 Research Reports', count: sharedMessages.filter(m => m.category === AIContentCategory.RESEARCH_REPORT).length },
    { value: AIContentCategory.DOCUMENT_ANALYSIS, label: '📄 Document Analysis', count: sharedMessages.filter(m => m.category === AIContentCategory.DOCUMENT_ANALYSIS).length },
    { value: AIContentCategory.BUSINESS_INTELLIGENCE, label: '💼 Business Intelligence', count: sharedMessages.filter(m => m.category === AIContentCategory.BUSINESS_INTELLIGENCE).length },
    { value: AIContentCategory.TECHNICAL_ANALYSIS, label: '⚙️ Technical Analysis', count: sharedMessages.filter(m => m.category === AIContentCategory.TECHNICAL_ANALYSIS).length },
    { value: AIContentCategory.MARKET_INSIGHTS, label: '📈 Market Insights', count: sharedMessages.filter(m => m.category === AIContentCategory.MARKET_INSIGHTS).length },
    { value: AIContentCategory.CODE_ANALYSIS, label: '💻 Code Analysis', count: sharedMessages.filter(m => m.category === AIContentCategory.CODE_ANALYSIS).length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading AI insights library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Bot className="w-8 h-8 text-purple-300" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Insights Library</h1>
          </div>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Explore our collection of AI-generated research, analysis, and insights shared by the community.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-white/70">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>{sharedMessages.length} AI Analyses</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{sharedMessages.reduce((sum, m) => sum + m.viewCount, 0)} Total Views</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Search AI insights, topics, or content..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <Button
                variant={filters.sortBy === 'recent' ? 'default' : 'outline'}
                onClick={() => setFilters(prev => ({ ...prev, sortBy: 'recent' }))}
                className="border-white/20 text-white"
              >
                Recent
              </Button>
              <Button
                variant={filters.sortBy === 'popular' ? 'default' : 'outline'}
                onClick={() => setFilters(prev => ({ ...prev, sortBy: 'popular' }))}
                className="border-white/20 text-white"
              >
                Popular
              </Button>
              <Button
                variant={filters.sortBy === 'confidence' ? 'default' : 'outline'}
                onClick={() => setFilters(prev => ({ ...prev, sortBy: 'confidence' }))}
                className="border-white/20 text-white"
              >
                High Confidence
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.category === option.value ? 'default' : 'outline'}
                onClick={() => setFilters(prev => ({ ...prev, category: option.value as any }))}
                className="border-white/20 text-white text-sm"
              >
                {option.label}
                {option.count > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    {option.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-white/70 mb-6">
          Showing {filteredMessages.length} of {sharedMessages.length} AI insights
          {filters.search && ` matching "${filters.search}"`}
        </div>

        {/* AI Content Grid */}
        {filteredMessages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMessages.map((sharedMessage) => (
              <AIContentCard key={sharedMessage.id} sharedMessage={sharedMessage} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">No AI insights found</h3>
            <p className="text-white/70">
              {filters.search 
                ? `No results match your search for "${filters.search}"`
                : 'No AI insights have been shared yet'
              }
            </p>
          </div>
        )}

        {/* Back to Discordant */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Discordant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 