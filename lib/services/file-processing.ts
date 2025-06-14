import { db } from "@/lib/db";
import { FileType, ProcessingStatus } from "@prisma/client";
import OpenAI from "openai";
import { WorkflowRouter } from "@/lib/system/workflow-router";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FileAnalysisResult {
  extractedText?: string;
  description?: string;
  tags: string[];
  businessContext?: string;
  aiSummary?: string;
  aiCategories: string[];
  businessEntities: string[];
  actionItems: string[];
  location?: {
    address?: string;
    businessName?: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface ExternalDocumentResult {
  googleDocsUrl?: string;
  sharePointUrl?: string;
  confluenceUrl?: string;
  externalLinks: Array<{
    type: 'google_docs' | 'sharepoint' | 'confluence' | 'other';
    url: string;
    title: string;
    description?: string;
  }>;
}

export class FileProcessingService {
  /**
   * Main entry point for processing uploaded files
   */
  static async processUploadedFile(
    fileUrl: string,
    messageId?: string,
    directMessageId?: string,
    memberId?: string,
    channelId?: string,
    userPrompt?: string
  ): Promise<void> {
    try {
      console.log(`[FILE_PROCESSING] Starting processing for: ${fileUrl}`);

      // Determine file type
      const fileType = this.determineFileType(fileUrl);
      
      // Create initial metadata record
      const metadata = await db.fileMetadata.create({
        data: {
          originalUrl: fileUrl,
          fileName: this.extractFileName(fileUrl),
          fileType,
          processingStatus: ProcessingStatus.PROCESSING,
          messageId,
          directMessageId,
        },
      });

      // Enhanced analysis with AI
      const analysisResult = await this.analyzeFileContent(fileUrl, fileType, userPrompt);
      
      // Create external documents if file is large/complex
      const externalDocs = await this.createExternalDocuments(
        fileUrl,
        fileType,
        analysisResult,
        metadata.id
      );

      // Update metadata with analysis results
      await db.fileMetadata.update({
        where: { id: metadata.id },
        data: {
          extractedText: analysisResult.extractedText,
          description: analysisResult.description,
          tags: JSON.stringify(analysisResult.tags),
          location: analysisResult.location ? JSON.stringify(analysisResult.location) : null,
          businessContext: analysisResult.businessContext,
          aiSummary: analysisResult.aiSummary,
          aiCategories: JSON.stringify(analysisResult.aiCategories),
          businessEntities: JSON.stringify(analysisResult.businessEntities),
          actionItems: JSON.stringify(analysisResult.actionItems),
          googleDocsUrl: externalDocs.googleDocsUrl,
          sharePointUrl: externalDocs.sharePointUrl,
          confluenceUrl: externalDocs.confluenceUrl,
          externalLinks: JSON.stringify(externalDocs.externalLinks),
          processingStatus: ProcessingStatus.COMPLETED,
          ocrCompleted: !!analysisResult.extractedText,
          aiAnalyzed: true,
          lastProcessed: new Date(),
        },
      });

      // Trigger n8n workflows for further processing
      if (channelId && memberId) {
        await this.triggerWorkflows(metadata.id, fileUrl, fileType, analysisResult, channelId, memberId);
      }

      console.log(`[FILE_PROCESSING] Successfully processed file: ${metadata.id}`);

    } catch (error) {
      console.error(`[FILE_PROCESSING] Error processing file:`, error);
      
      // Update status to failed if metadata exists
      if (messageId || directMessageId) {
        try {
          await db.fileMetadata.updateMany({
            where: {
              OR: [
                { messageId },
                { directMessageId }
              ]
            },
            data: {
              processingStatus: ProcessingStatus.FAILED,
              lastProcessed: new Date(),
            },
          });
        } catch (updateError) {
          console.error(`[FILE_PROCESSING] Failed to update error status:`, updateError);
        }
      }
    }
  }

  /**
   * Analyze file content using AI (OCR + Vision + Text Analysis)
   */
  private static async analyzeFileContent(
    fileUrl: string,
    fileType: FileType,
    userPrompt?: string
  ): Promise<FileAnalysisResult> {
    try {
      let extractedText = '';
      let aiAnalysis: any = {};

      if (fileType === FileType.PDF) {
        // For PDFs, use OCR extraction (you might want to integrate with a PDF processing service)
        extractedText = await this.extractPDFText(fileUrl);
      } else if (fileType === FileType.IMAGE) {
        // For images, use OpenAI Vision
        const visionResult = await this.analyzeImageWithVision(fileUrl, userPrompt);
        extractedText = visionResult.extractedText || '';
        aiAnalysis = visionResult.analysis;
      }

      // Enhanced text analysis for business context
      const businessAnalysis = await this.analyzeBusinessContext(extractedText, userPrompt);

      return {
        extractedText,
        description: aiAnalysis.description || businessAnalysis.description,
        tags: [...(aiAnalysis.tags || []), ...(businessAnalysis.tags || [])],
        businessContext: businessAnalysis.businessContext,
        aiSummary: businessAnalysis.summary,
        aiCategories: businessAnalysis.categories || [],
        businessEntities: businessAnalysis.entities || [],
        actionItems: businessAnalysis.actionItems || [],
        location: aiAnalysis.location || businessAnalysis.location,
      };

    } catch (error) {
      console.error(`[FILE_PROCESSING] Error in AI analysis:`, error);
      return {
        tags: [],
        aiCategories: [],
        businessEntities: [],
        actionItems: [],
      };
    }
  }

  /**
   * Analyze image using OpenAI Vision
   */
  private static async analyzeImageWithVision(
    imageUrl: string,
    userPrompt?: string
  ): Promise<{ extractedText?: string; analysis: any }> {
    try {
      const systemPrompt = `You are an expert business document analyzer. Analyze this image and provide:

1. Extract ALL visible text (OCR)
2. Identify business context (meetings, locations, companies, people)
3. Categorize the content type
4. Extract any action items or important information
5. Identify location information if visible
6. Suggest relevant tags

${userPrompt ? `User Context: ${userPrompt}` : ''}

Respond in JSON format with: extractedText, description, tags, categories, entities, actionItems, location, businessRelevance`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image for business intelligence and document processing:",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        extractedText: analysis.extractedText,
        analysis,
      };

    } catch (error) {
      console.error(`[FILE_PROCESSING] Vision analysis error:`, error);
      return { analysis: {} };
    }
  }

  /**
   * Extract text from PDF (placeholder - implement with your preferred PDF service)
   */
  private static async extractPDFText(pdfUrl: string): Promise<string> {
    try {
      // TODO: Implement PDF text extraction
      // Options: pdf-parse, PDF.js, or external service like Adobe PDF Services
      console.log(`[FILE_PROCESSING] PDF text extraction needed for: ${pdfUrl}`);
      return "PDF text extraction not yet implemented";
    } catch (error) {
      console.error(`[FILE_PROCESSING] PDF extraction error:`, error);
      return "";
    }
  }

  /**
   * Analyze business context from extracted text
   */
  private static async analyzeBusinessContext(
    text: string,
    userPrompt?: string
  ): Promise<any> {
    if (!text || text.trim().length < 10) {
      return {
        description: "No significant text content found",
        tags: [],
        categories: [],
        entities: [],
        actionItems: [],
      };
    }

    try {
      const systemPrompt = `You are a business intelligence analyst. Analyze this text content and provide:

1. Business context and relevance
2. Key entities (companies, people, locations)
3. Action items and next steps
4. Content categorization
5. Relevant tags for organization
6. Summary of key points

${userPrompt ? `User Context: ${userPrompt}` : ''}

Respond in JSON format with: description, businessContext, summary, categories, entities, actionItems, tags, location`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Analyze this content:\n\n${text.substring(0, 4000)}`, // Limit text length
          },
        ],
        max_tokens: 1500,
        temperature: 0.1,
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');

    } catch (error) {
      console.error(`[FILE_PROCESSING] Business context analysis error:`, error);
      return {
        description: "Analysis failed",
        tags: [],
        categories: [],
        entities: [],
        actionItems: [],
      };
    }
  }

  /**
   * Create external documents for large/complex files
   */
  private static async createExternalDocuments(
    fileUrl: string,
    fileType: FileType,
    analysis: FileAnalysisResult,
    metadataId: string
  ): Promise<ExternalDocumentResult> {
    const result: ExternalDocumentResult = {
      externalLinks: [],
    };

    try {
      // For large PDFs or complex content, create external docs
      const shouldCreateExternal = this.shouldCreateExternalDocument(fileUrl, analysis);

      if (shouldCreateExternal) {
        // TODO: Implement external document creation
        // - Google Docs API integration
        // - SharePoint API integration
        // - Confluence API integration
        
        console.log(`[FILE_PROCESSING] External document creation needed for: ${metadataId}`);
        
        // Placeholder for Google Docs creation
        if (analysis.extractedText && analysis.extractedText.length > 5000) {
          result.externalLinks.push({
            type: 'google_docs',
            url: `https://docs.google.com/document/placeholder-${metadataId}`,
            title: `Processed Document - ${metadataId}`,
            description: 'Full text content extracted and enhanced',
          });
        }
      }

    } catch (error) {
      console.error(`[FILE_PROCESSING] External document creation error:`, error);
    }

    return result;
  }

  /**
   * Trigger n8n workflows for additional processing
   */
  private static async triggerWorkflows(
    metadataId: string,
    fileUrl: string,
    fileType: FileType,
    analysis: FileAnalysisResult,
    channelId: string,
    memberId: string
  ): Promise<void> {
    try {
      // Create message object for workflow routing
      const mockMessage = {
        id: metadataId,
        content: `File uploaded: ${analysis.description || 'New file'}`,
        fileUrl,
        member: {
          profile: {
            id: memberId,
            name: 'File Processor',
          },
        },
      };

      // Enhanced workflow payload with file metadata
      const workflowPayload = {
        ...WorkflowRouter.createWorkflowPayload(mockMessage as any, {
          pattern: 'file_analysis',
          workflowId: 'file-processor',
          priority: 5,
          webhookPath: 'file-processor',
          description: 'File analysis and processing workflow',
          mode: 'async'
        }, channelId),
        fileMetadata: {
          metadataId,
          fileType,
          extractedText: analysis.extractedText,
          businessContext: analysis.businessContext,
          categories: analysis.aiCategories,
          entities: analysis.businessEntities,
          actionItems: analysis.actionItems,
          tags: analysis.tags,
        },
      };

      // Trigger workflow via your existing system
      console.log(`[FILE_PROCESSING] Triggering workflows for: ${metadataId}`);
      
      // Update workflow status
      await db.fileMetadata.update({
        where: { id: metadataId },
        data: {
          workflowTriggered: true,
          workflowResults: JSON.stringify({ triggered: true, timestamp: new Date() }),
        },
      });

    } catch (error) {
      console.error(`[FILE_PROCESSING] Workflow trigger error:`, error);
    }
  }

  /**
   * Utility methods
   */
  private static determineFileType(fileUrl: string): FileType {
    const url = fileUrl.toLowerCase();
    
    if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) return FileType.IMAGE;
    if (url.match(/\.(pdf)$/)) return FileType.PDF;
    if (url.match(/\.(mp4|mov|avi|mkv)$/)) return FileType.VIDEO;
    if (url.match(/\.(mp3|wav|flac|aac)$/)) return FileType.AUDIO;
    if (url.match(/\.(doc|docx|txt|rtf)$/)) return FileType.DOCUMENT;
    
    return FileType.OTHER;
  }

  private static extractFileName(fileUrl: string): string {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      return pathname.split('/').pop() || 'unknown_file';
    } catch {
      return fileUrl.split('/').pop() || 'unknown_file';
    }
  }

  private static shouldCreateExternalDocument(
    fileUrl: string,
    analysis: FileAnalysisResult
  ): boolean {
    // Create external docs for:
    // 1. Large PDFs (>5MB inferred from text length)
    // 2. Complex business documents
    // 3. Documents with many action items
    
    return (
      (analysis.extractedText && analysis.extractedText.length > 5000) ||
      (analysis.actionItems && analysis.actionItems.length > 3) ||
      (analysis.businessEntities && analysis.businessEntities.length > 5) ||
      fileUrl.includes('.pdf')
    );
  }

  /**
   * Get file metadata by message ID
   */
  static async getFileMetadata(messageId?: string, directMessageId?: string) {
    if (!messageId && !directMessageId) return null;

    return await db.fileMetadata.findFirst({
      where: {
        OR: [
          messageId ? { messageId } : {},
          directMessageId ? { directMessageId } : {},
        ].filter(Boolean),
      },
    });
  }

  /**
   * Update processing status
   */
  static async updateProcessingStatus(
    metadataId: string,
    status: ProcessingStatus,
    additionalData?: any
  ) {
    return await db.fileMetadata.update({
      where: { id: metadataId },
      data: {
        processingStatus: status,
        lastProcessed: new Date(),
        ...(additionalData || {}),
      },
    });
  }
} 