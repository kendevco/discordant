import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log('=== ASYNC WORKFLOW REQUEST ===');
    const startTime = Date.now();
    
    const body = await request.json();
    const workflowId = request.headers.get("X-Workflow-Id");
    const webhookPath = request.headers.get("X-Webhook-Path") || "discordant-ai-services";
    
    console.log('Request body keys:', Object.keys(body));
    console.log('Message content:', body.message?.substring(0, 100));
    console.log('Channel ID:', body.channelId);
    console.log('User ID:', body.userId);
    console.log('Workflow ID:', workflowId);
    console.log('Webhook path:', webhookPath);

    // Construct n8n webhook URL
    const rawN8nUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.kendev.co/webhook";
    const n8nBaseUrl = rawN8nUrl.replace(/[";]/g, '').trim();
    const webhookUrl = `${n8nBaseUrl}/${webhookPath}`;
    
    console.log(`📍 Final Webhook URL: ${webhookUrl}`);
    
    // Immediate response to Discord
    const immediateResponse = {
      success: true,
      status: 'processing',
      message: '🤖 **AI Processing Started**\n\nYour request is being processed by the Enhanced Business Intelligence AI Agent.\n\n⏳ **Status**: Workflow initiated\n📊 **Processing**: Advanced AI tools activating\n🔄 **ETA**: Response incoming shortly\n\n*Your AI response will appear in this channel momentarily...*',
      channelId: body.channelId,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      metadata: {
        workflowId,
        webhookPath,
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    };
    
    // Fire async request to n8n (don't await)
    console.log('Starting async workflow execution...');
    
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Discordant-Async/1.0',
        'X-Source': 'discordant-async-workflow',
        'X-Callback-URL': 'https://discordant.kendev.co/api/ai/workflow-complete',
        'X-Workflow-Id': workflowId || 'discordant-agent-0001'
      },
      body: JSON.stringify({
        ...body,
        asyncMode: true,
        callbackUrl: 'https://discordant.kendev.co/api/ai/workflow-complete',
        requestId: immediateResponse.metadata.requestId,
        workflowId: workflowId || 'discordant-agent-0001'
      })
    }).then(async (n8nResponse) => {
      console.log('=== ASYNC WORKFLOW RESPONSE ===');
      console.log('n8n Status:', n8nResponse.status);
      console.log('n8n Headers:', Object.fromEntries(n8nResponse.headers.entries()));
      
      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('n8n Async Error:', errorText);
        console.error('n8n Status:', n8nResponse.status);
        
        // Send error callback
        const errorCallbackUrl = 'https://discordant.kendev.co/api/ai/workflow-complete';
        console.log('Sending error callback to:', errorCallbackUrl);
        
        await fetch(errorCallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `❌ **Workflow Error**\n\nThe AI processing encountered an issue:\n\n**Error**: ${errorText || 'Unknown error'}\n**Status**: ${n8nResponse.status}\n**Time**: ${new Date().toLocaleTimeString()}\n**Workflow**: ${workflowId || 'discordant-agent-0001'}\n\n**Recommendation**: Try your request again or contact support if the issue persists.`,
            metadata: {
              channelId: body.channelId,
              userId: body.userId,
              sessionId: body.sessionId,
              errorOccurred: true,
              errorStatus: n8nResponse.status,
              errorText: errorText || 'Unknown error',
              timestamp: new Date().toISOString(),
              workflowId: workflowId || 'discordant-agent-0001'
            }
          })
        }).catch(callbackError => {
          console.error('Failed to send error callback:', callbackError);
        });
      } else {
        const responseText = await n8nResponse.text();
        console.log('n8n async workflow response:', responseText.substring(0, 200));
        console.log('n8n workflow initiated successfully - awaiting callback');
        // The workflow will handle its own callback via Async_Callback_Response node
      }
    }).catch((fetchError) => {
      console.error('=== ASYNC FETCH ERROR ===');
      console.error('Fetch error:', fetchError);
      console.error('Webhook URL:', webhookUrl);
      
      // Send error callback for network issues
      const errorCallbackUrl = 'https://discordant.kendev.co/api/ai/workflow-complete';
      console.log('Sending network error callback to:', errorCallbackUrl);
      
      fetch(errorCallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **Network Error**\n\nCouldn't connect to the AI workflow service.\n\n**Error**: ${fetchError.message}\n**Time**: ${new Date().toLocaleTimeString()}\n**Webhook**: ${webhookUrl}\n\n**Status**: Network connectivity issue detected\n**Action**: Please try again or contact support`,
          metadata: {
            channelId: body.channelId,
            userId: body.userId,
            sessionId: body.sessionId,
            networkError: true,
            fetchError: fetchError.message,
            webhookUrl,
            timestamp: new Date().toISOString(),
            workflowId: workflowId || 'discordant-agent-0001'
          }
        })
      }).catch(e => console.error('Failed to send network error callback:', e));
    });
    
    // Return immediate response
    console.log('=== IMMEDIATE RESPONSE SENT ===');
    console.log('Response time:', Date.now() - startTime, 'ms');
    console.log('Channel ID:', body.channelId);
    
    return NextResponse.json(immediateResponse);
    
  } catch (error) {
    console.error('=== WORKFLOW REQUEST ERROR ===');
    console.error('Error details:', error);
    
    return NextResponse.json({
      error: 'Workflow request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      type: 'request_error'
    }, { status: 500 });
  }
} 