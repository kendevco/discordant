export interface VAPICall {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  type: "inboundPhoneCall" | "outboundPhoneCall" | "webCall";
  phoneCallProvider: "twilio" | "vonage" | "vapi";
  phoneCallProviderId: string;
  status: "queued" | "ringing" | "in-progress" | "forwarding" | "ended";
  endedReason?: "user-hung-up" | "assistant-hung-up" | "call-timeout" | "exceeded-max-duration" | "assistant-error" | "call-provider-error";
  cost?: number;
  costBreakdown?: {
    transport: number;
    stt: number;
    llm: number;
    tts: number;
    vapi: number;
    total: number;
  };
  phoneNumber?: string;
  assistantId?: string;
  squadId?: string;
  messages: VAPIMessage[];
  artifact?: any;
  recordingUrl?: string;
  transcript?: string;
  summary?: string;
  analysis?: ConversationAnalysis;
  duration?: number;
  startedAt?: string;
  endedAt?: string;
  metadata?: Record<string, any>;
}

export interface VAPIMessage {
  role: "user" | "assistant" | "system" | "function" | "tool";
  message: string;
  time: number;
  endTime?: number;
  secondsFromStart: number;
  duration?: number;
  toolCalls?: VAPIToolCall[];
  artifact?: any;
}

export interface VAPIToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
  result?: string;
}

export interface VAPIWebhookEvent {
  message: {
    type: "webhook";
    call?: VAPICall;
    phoneNumber?: VAPIPhoneNumber;
    customer?: VAPICustomer;
    artifact?: any;
    transcript?: string;
    recordingUrl?: string;
    summary?: string;
    tool_calls?: VAPIToolCall[];
    toolCallId?: string;
    tool_call_id?: string;
  };
}

export interface VAPIPhoneNumber {
  twilioPhoneNumber: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  name: string;
  assistantId: string;
  squadId?: string;
  serverUrl?: string;
  serverUrlSecret?: string;
}

export interface VAPICustomer {
  number: string;
  extension?: string;
  name?: string;
  email?: string;
  metadata?: Record<string, any>;
}

export interface VAPIAssistant {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  model: VAPIModel;
  voice: VAPIVoice;
  transcriber?: VAPITranscriber;
  firstMessage?: string;
  systemMessage?: string;
  recordingEnabled?: boolean;
  endCallMessage?: string;
  endCallPhrases?: string[];
  backgroundSound?: "office" | "none";
  backchannelingEnabled?: boolean;
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  transportConfigurations?: VAPITransportConfiguration[];
  functions?: VAPIFunction[];
  metadata?: Record<string, any>;
}

export interface VAPIModel {
  provider: "openai" | "anthropic" | "azure-openai";
  model: string;
  temperature?: number;
  maxTokens?: number;
  emotionRecognitionEnabled?: boolean;
  numFastTurns?: number;
  tools?: VAPIFunction[];
}

export interface VAPIVoice {
  provider: "11labs" | "azure" | "rime" | "deepgram" | "openai";
  voiceId: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  optimizeStreamingLatency?: number;
  enableSsmlParsing?: boolean;
  speed?: number;
  fillerInjectionEnabled?: boolean;
}

export interface VAPITranscriber {
  provider: "deepgram" | "whisper" | "talkscriber";
  model?: string;
  language?: string;
  smartFormat?: boolean;
  languageDetectionEnabled?: boolean;
  keywords?: string[];
  endpointing?: number;
}

export interface VAPITransportConfiguration {
  provider: "twilio" | "vonage" | "vapi";
  timeout?: number;
  record?: boolean;
  recordingChannels?: "mono" | "dual";
}

export interface VAPIFunction {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, VAPIFunctionProperty>;
    required?: string[];
  };
  async?: boolean;
}

export interface VAPIFunctionProperty {
  type: "string" | "number" | "integer" | "boolean" | "array" | "object";
  description?: string;
  enum?: string[];
  items?: VAPIFunctionProperty;
  properties?: Record<string, VAPIFunctionProperty>;
  required?: string[];
}

export interface VAPIResponse {
  toolCallId: string;
  result: string;
  error?: string;
}

export interface ConversationAnalysis {
  action: "SCHEDULE" | "EMAIL" | "FOLLOWUP" | "SUPPORT" | "INFO" | "NOT_INTERESTED";
  summary: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  userDetails: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    title?: string;
    preferredTime?: string;
    budget?: string;
    timeline?: string;
    requirements?: string;
    interestLevel?: "HIGH" | "MEDIUM" | "LOW";
  };
  nextSteps: string;
  tags?: string[];
  confidence: number;
  extractedInfo?: Record<string, any>;
}

export interface CallPurpose {
  type: "verification" | "gatekeeper" | "outbound_sales" | "follow_up" | "support" | "general";
  description: string;
  expectedDuration: number; // in seconds
  maxDuration: number; // in seconds
  objectives: string[];
  successCriteria: string[];
}

export interface CallMetrics {
  callId: string;
  duration: number;
  cost: number;
  transcript: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  outcome: "SUCCESS" | "PARTIAL_SUCCESS" | "FAILURE";
  objectives_met: string[];
  conversion_rate?: number;
  quality_score?: number;
  customer_satisfaction?: number;
  follow_up_required: boolean;
  notes?: string;
}

export interface VAPISettings {
  defaultAssistantId: string;
  assistants: {
    gatekeeper?: string;
    sales?: string;
    verification?: string;
    followUp?: string;
    support?: string;
  };
  phoneNumbers: {
    primary: string;
    backup?: string;
    verification?: string;
  };
  webhooks: {
    primary: string;
    backup?: string;
    events: VAPIWebhookEvent[];
  };
  recording: {
    enabled: boolean;
    retention: number; // days
    transcription: boolean;
    analysis: boolean;
  };
  limits: {
    dailyCalls: number;
    concurrentCalls: number;
    maxDuration: number; // seconds
    costLimit: number; // dollars
  };
}

export interface VAPIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  callId?: string;
  assistantId?: string;
}

// Event types for webhook handling
export type VAPIEventType = 
  | "call-started"
  | "call-ended"
  | "call-failed"
  | "transcript-updated"
  | "function-called"
  | "recording-available"
  | "analysis-complete"
  | "error-occurred";

export interface VAPIWebhookPayload {
  event: VAPIEventType;
  timestamp: string;
  data: any;
  signature?: string;
  version: string;
}

// Contact management types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  title?: string;
  tags?: string[];
  status: "new" | "contacted" | "qualified" | "converted" | "not_interested" | "do_not_call";
  lastContact?: string;
  nextFollowUp?: string;
  notes?: string;
  callHistory: VAPICall[];
  metadata?: Record<string, any>;
}

export interface CallCampaign {
  id: string;
  name: string;
  description: string;
  purpose: CallPurpose;
  assistantId: string;
  contacts: Contact[];
  status: "draft" | "active" | "paused" | "completed";
  schedule?: {
    startDate: string;
    endDate: string;
    timeZone: string;
    businessHours: {
      start: string;
      end: string;
      days: number[];
    };
  };
  metrics: {
    totalCalls: number;
    completedCalls: number;
    successfulCalls: number;
    totalDuration: number;
    totalCost: number;
    conversionRate: number;
    averageCallDuration: number;
  };
  settings: {
    maxRetries: number;
    retryDelay: number; // hours
    skipWeekends: boolean;
    respectTimezones: boolean;
  };
}

// Integration types
export interface N8NWebhookData {
  event: string;
  timestamp: string;
  callId?: string;
  data: any;
  source: "vapi";
}

export interface SugarCRMData {
  leadId?: string;
  contactId?: string;
  accountId?: string;
  opportunityId?: string;
  callLog: {
    date: string;
    duration: number;
    outcome: string;
    notes: string;
    recording?: string;
    transcript?: string;
  };
}

export interface DiscordNotification {
  channel: string;
  message: string;
  embed?: {
    title: string;
    description: string;
    color: string;
    fields: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp: string;
  };
} 