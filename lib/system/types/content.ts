export interface ContentAnalysis {
  contentType: string;
  targetChannel?: string;
  confidence: number;
}

export interface ContentRoutingRule {
  pattern: RegExp;
  targetChannel: string;
  priority: number;
  description: string;
}
