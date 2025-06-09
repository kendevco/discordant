import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Bot, Brain, Eye, Calendar, User, ExternalLink, ArrowLeft, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAIContentTypeLabel } from '@/lib/utils/ai-detection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface SharedAIResponsePageProps {
  params: Promise<{
    shareId: string;
  }>;
}

async function getSharedMessage(shareId: string) {
  const sharedMessage = await db.sharedMessage.findUnique({
    where: {
      shareId,
      isPublic: true,
    },
    include: {
      message: {
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          channel: {
            include: {
              server: true,
            },
          },
          fileMetadata: true,
        },
      },
      directMessage: {
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          fileMetadata: true,
        },
      },
    },
  });

  if (!sharedMessage) {
    return null;
  }

  // Increment view count
  await db.sharedMessage.update({
    where: { id: sharedMessage.id },
    data: { 
      viewCount: { increment: 1 },
      lastViewed: new Date(),
    },
  });

  return sharedMessage;
}

async function getRelatedAIContent(category: string, currentId: string) {
  return await db.sharedMessage.findMany({
    where: {
      category: category as any,
      isPublic: true,
      id: { not: currentId },
    },
    take: 3,
    orderBy: {
      viewCount: 'desc',
    },
    include: {
      message: {
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      },
      directMessage: {
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });
}

function AIProcessingMetadata({ metadata }: { metadata: any }) {
  if (!metadata) return null;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {metadata.processingTime && (
        <div>
          <span className="font-medium">Processing Time:</span>
          <span className="ml-2 text-gray-600">{metadata.processingTime}ms</span>
        </div>
      )}
      {metadata.confidence && (
        <div>
          <span className="font-medium">Confidence Score:</span>
          <span className="ml-2 text-gray-600">{(metadata.confidence * 100).toFixed(0)}%</span>
        </div>
      )}
      {metadata.aiCategories && (
        <div className="col-span-2">
          <span className="font-medium">AI Categories:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {JSON.parse(metadata.aiCategories).map((category: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AIResponseRenderer({ content, enhanced, showMetadata, fileUrl }: {
  content: string;
  enhanced?: boolean;
  showMetadata?: boolean;
  fileUrl?: string | null;
}) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4">
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {lines.map((line, index) => {
          if (line.startsWith('##')) {
            return (
              <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                {line.replace(/^##\s*/, '')}
              </h2>
            );
          }
          
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <h3 key={index} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
                {line.replace(/^\*\*|\*\*$/g, '')}
              </h3>
            );
          }
          
          if (line.startsWith('- ')) {
            return (
              <ul key={index} className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>{line.replace(/^- /, '')}</li>
              </ul>
            );
          }
          
          if (line.trim() === '') {
            return <div key={index} className="h-2" />;
          }
          
          return (
            <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
      
      {fileUrl && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Attachment</span>
          </div>
          <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            View Original File
          </a>
        </div>
      )}
    </div>
  );
}

function RelatedAIContent({ related }: { related: any[] }) {
  if (!related.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        Related AI Insights
      </h3>
      <div className="grid gap-4">
        {related.map((item) => {
          const message = item.message || item.directMessage;
          const preview = message.content.substring(0, 150) + '...';
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {getAIContentTypeLabel(item.category)}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.viewCount} views</span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {preview}
                </p>
                <Link 
                  href={`/shared/${item.shareId}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  View Analysis <ExternalLink className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const SharedAIResponsePage: NextPage<SharedAIResponsePageProps> = async ({ params }) => {
  const resolvedParams = await params;
  const sharedMessage = await getSharedMessage(resolvedParams.shareId);

  if (!sharedMessage) {
    notFound();
  }

  const message = sharedMessage.message || sharedMessage.directMessage;
  const relatedContent = await getRelatedAIContent(sharedMessage.category, sharedMessage.id);

  if (!message) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Discordant
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Bot className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{sharedMessage.title}</h1>
                <p className="text-purple-200">{getAIContentTypeLabel(sharedMessage.category)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Generated {formatDistanceToNow(sharedMessage.sharedAt)} ago</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{sharedMessage.viewCount} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                <span>Powered by AI</span>
              </div>
              {sharedMessage.confidenceScore && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-200">
                  {(sharedMessage.confidenceScore * 100).toFixed(0)}% Confidence
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Card className="bg-white dark:bg-gray-900 shadow-xl">
            <CardHeader>
              {sharedMessage.description && (
                <p className="text-gray-600 dark:text-gray-400">{sharedMessage.description}</p>
              )}
              {sharedMessage.sourceUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <a 
                    href={sharedMessage.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Original Source
                  </a>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {sharedMessage.executiveSummary && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Executive Summary</h3>
                  <p className="text-blue-800 dark:text-blue-200">{sharedMessage.executiveSummary}</p>
                </div>
              )}
              
              <AIResponseRenderer 
                content={message.content}
                enhanced={sharedMessage.enhanceForSharing}
                showMetadata={sharedMessage.includeMetadata}
                fileUrl={message.fileUrl}
              />
              
              {sharedMessage.keyInsights && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Key Insights</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200">
                    {JSON.parse(sharedMessage.keyInsights).map((insight: string, index: number) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Details */}
          {sharedMessage.includeMetadata && message.fileMetadata && (
            <Card className="mt-6 bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Processing Details
                </h3>
              </CardHeader>
              <CardContent>
                <AIProcessingMetadata metadata={message.fileMetadata} />
              </CardContent>
            </Card>
          )}

          {/* Related AI Content */}
          <RelatedAIContent related={relatedContent} />
        </div>
      </div>
    </div>
  );
};

export default SharedAIResponsePage; 