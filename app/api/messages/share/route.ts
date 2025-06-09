import { NextRequest, NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { detectAIContent, generateShareTitle } from "@/lib/utils/ai-detection";
import { AIContentCategory } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      messageId,
      directMessageId,
      title,
      description,
      category,
      sourceUrl,
      isPublic,
      includeMetadata,
      enhanceForSharing,
      allowComments,
    } = body;

    if (!messageId && !directMessageId) {
      return new NextResponse("Message ID or Direct Message ID required", { status: 400 });
    }

    // Verify the message exists and user has access
    let message;
    if (messageId) {
      message = await db.message.findFirst({
        where: {
          id: messageId,
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          channel: {
            include: {
              server: {
                include: {
                  members: {
                    where: {
                      profileId: profile.id,
                    },
                  },
                },
              },
            },
          },
          fileMetadata: true,
        },
      });

      if (!message) {
        return new NextResponse("Message not found", { status: 404 });
      }

      // Check if user has access to the server
      if (!message.channel.server.members.length) {
        return new NextResponse("Access denied", { status: 403 });
      }
    } else {
      message = await db.directMessage.findFirst({
        where: {
          id: directMessageId,
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          conversation: {
            include: {
              memberOne: {
                include: {
                  profile: true,
                },
              },
              memberTwo: {
                include: {
                  profile: true,
                },
              },
            },
          },
          fileMetadata: true,
        },
      });

      if (!message) {
        return new NextResponse("Direct message not found", { status: 404 });
      }

      // Check if user is part of the conversation
      const isParticipant = 
        message.conversation.memberOne.profileId === profile.id ||
        message.conversation.memberTwo.profileId === profile.id;

      if (!isParticipant) {
        return new NextResponse("Access denied", { status: 403 });
      }
    }

    // Generate AI enhancement if requested
    let executiveSummary = null;
    let keyInsights = null;
    let confidenceScore = null;
    let processingTime = null;

    if (enhanceForSharing) {
      const startTime = Date.now();
      
      try {
        // Generate executive summary (placeholder - integrate with your AI service)
        executiveSummary = await generateExecutiveSummary(message.content);
        
        // Extract key insights (placeholder - integrate with your AI service)
        keyInsights = JSON.stringify(await extractKeyInsights(message.content));
        
        processingTime = Date.now() - startTime;
      } catch (error) {
        console.error("[AI_ENHANCEMENT_ERROR]", error);
        // Continue without enhancement
      }
    }

    // Detect AI content for metadata
    const detection = detectAIContent(message);
    confidenceScore = detection.confidenceScore;

    // Generate unique share ID
    const shareId = `ai-${randomUUID().substring(0, 8)}`;

    // Create shared message record
    const sharedMessage = await db.sharedMessage.create({
      data: {
        shareId,
        messageId: messageId || undefined,
        directMessageId: directMessageId || undefined,
        title: title || generateShareTitle(message.content, category),
        description,
        category: category || AIContentCategory.GENERAL_AI_RESPONSE,
        isPublic,
        allowComments,
        isAIGenerated: detection.isAIGenerated,
        sourceUrl: sourceUrl || detection.sourceUrl,
        confidenceScore,
        processingTime,
        includeMetadata,
        enhanceForSharing,
        executiveSummary,
        keyInsights,
        sharedBy: profile.id,
        viewCount: 0,
      },
    });

    return NextResponse.json({
      shareId: sharedMessage.shareId,
      url: `/shared/${sharedMessage.shareId}`,
      success: true,
    });
  } catch (error) {
    console.error("[SHARE_MESSAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Placeholder AI enhancement functions - integrate with your preferred AI service
async function generateExecutiveSummary(content: string): Promise<string> {
  // This would integrate with OpenAI, Claude, or your AI service
  const lines = content.split('\n').filter(line => line.trim());
  const firstParagraph = lines.slice(0, 3).join(' ');
  
  return `Executive Summary: ${firstParagraph.substring(0, 200)}...`;
}

async function extractKeyInsights(content: string): Promise<string[]> {
  // This would use AI to extract key insights
  const insights = [];
  
  if (content.includes('analysis') || content.includes('findings')) {
    insights.push("Contains analytical findings");
  }
  
  if (content.includes('recommendation') || content.includes('suggest')) {
    insights.push("Includes recommendations");
  }
  
  if (content.includes('data') || content.includes('statistics')) {
    insights.push("Data-driven insights");
  }
  
  return insights.length > 0 ? insights : ["AI-generated content with structured analysis"];
} 