/**
 * N8N API Client for Direct Workflow Management
 * Provides comprehensive API access to n8n workflows for testing and iteration
 */

interface N8NWorkflowExecution {
  id: string;
  workflowId: string;
  status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'waiting';
  startedAt: string;
  stoppedAt?: string;
  data?: any;
  mode: 'manual' | 'trigger' | 'webhook';
}

interface N8NWorkflowData {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings?: any;
  pinData?: any;
  versionId?: string;
}

interface N8NExecutionOptions {
  workflowId?: string;
  webhookPath?: string;
  data?: any;
  waitTill?: 'executed' | 'running';
  timeout?: number;
}

export interface N8NTestResult {
  success: boolean;
  execution?: N8NWorkflowExecution;
  response?: any;
  error?: string;
  duration: number;
  timestamp: string;
}

export class N8NApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly webhookBaseUrl: string;

  constructor() {
    this.baseUrl = process.env.N8N_API_URL || 'https://n8n.kendev.co/api/v1';
    this.apiKey = process.env.N8N_API_KEY || '';
    this.webhookBaseUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.kendev.co/webhook';
    
    if (!this.apiKey) {
      console.warn('[N8N_API] No API key configured - limited functionality available');
    }
  }

  /**
   * Execute workflow directly via API
   */
  async executeWorkflow(workflowId: string, data: any = {}, options: N8NExecutionOptions = {}): Promise<N8NTestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[N8N_API] Executing workflow ${workflowId} with data:`, data);
      
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          waitTill: options.waitTill || 'executed'
        }),
        signal: AbortSignal.timeout(options.timeout || 60000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const duration = Date.now() - startTime;

      return {
        success: true,
        execution: result,
        response: result.data,
        duration,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('[N8N_API] Execution failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Execute workflow via webhook (more reliable for production)
   */
  async executeViaWebhook(webhookPath: string, data: any = {}, options: N8NExecutionOptions = {}): Promise<N8NTestResult> {
    const startTime = Date.now();
    
    try {
      const webhookUrl = `${this.webhookBaseUrl}/${webhookPath}`;
      console.log(`[N8N_WEBHOOK] Executing via webhook: ${webhookUrl}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Discordant-N8N-Test/1.0'
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(options.timeout || 60000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const duration = Date.now() - startTime;

      return {
        success: true,
        response: result,
        duration,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('[N8N_WEBHOOK] Execution failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get workflow details
   */
  async getWorkflow(workflowId: string): Promise<N8NWorkflowData | null> {
    if (!this.apiKey) {
      console.warn('[N8N_API] API key required for workflow details');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[N8N_API] Failed to get workflow:', error);
      return null;
    }
  }

  /**
   * Get execution details
   */
  async getExecution(executionId: string): Promise<N8NWorkflowExecution | null> {
    if (!this.apiKey) {
      console.warn('[N8N_API] API key required for execution details');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/executions/${executionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[N8N_API] Failed to get execution:', error);
      return null;
    }
  }

  /**
   * List recent executions for a workflow
   */
  async getWorkflowExecutions(workflowId: string, limit = 10): Promise<N8NWorkflowExecution[]> {
    if (!this.apiKey) {
      console.warn('[N8N_API] API key required for execution history');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/executions?workflowId=${workflowId}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('[N8N_API] Failed to get executions:', error);
      return [];
    }
  }

  /**
   * Update workflow (for iteration)
   */
  async updateWorkflow(workflowId: string, workflowData: Partial<N8NWorkflowData>): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('[N8N_API] API key required for workflow updates');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData)
      });

      return response.ok;
    } catch (error) {
      console.error('[N8N_API] Failed to update workflow:', error);
      return false;
    }
  }

  /**
   * Activate/deactivate workflow
   */
  async setWorkflowActive(workflowId: string, active: boolean): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('[N8N_API] API key required for workflow activation');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}/${active ? 'activate' : 'deactivate'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      return response.ok;
    } catch (error) {
      console.error('[N8N_API] Failed to set workflow active state:', error);
      return false;
    }
  }
}

// Export singleton instance
export const n8nApi = new N8NApiClient();

// Test data generators
export const N8NTestData = {
  // Enhanced Business Intelligence AI Agent test cases
  enhancedAI: {
    // Chat test interface format
    chatTest: (message: string) => ({
      chatInput: message,
      sessionId: `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: 'sendMessage'
    }),

    // Webhook format from Discordant
    webhookTest: (message: string, channelId?: string, serverId?: string) => ({
      message,
      userId: 'test-user-' + Date.now(),
      userName: 'Test User',
      channelId: channelId || 'test-channel-' + Date.now(),
      serverId: serverId || 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9',
      timestamp: new Date().toISOString(),
      metadata: {
        platform: 'discordant-chat',
        messageType: 'text',
        hasAttachment: false,
        priority: 'normal',
        sessionId: `test-session-${Date.now()}`,
        routedBy: 'n8n-api-test',
        workflowId: 'enhanced-ai-test',
        intent: 'test'
      }
    }),

    // VAPI test format
    vapiTest: (message: string) => ({
      message,
      platform: 'vapi',
      userId: 'vapi-test-user',
      userName: 'VAPI Test User',
      sessionId: `vapi-test-${Date.now()}`,
      timestamp: new Date().toISOString()
    }),

    // External API test format
    externalTest: (message: string) => ({
      message,
      platform: 'external-api',
      userId: 'external-test-user',
      userName: 'External Test User',
      sessionId: `external-test-${Date.now()}`,
      timestamp: new Date().toISOString()
    })
  }
}; 