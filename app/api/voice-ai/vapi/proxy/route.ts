import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { url: targetUrl, method = "POST", headers = {}, body, params } = await req.json();

    if (!targetUrl) {
      return NextResponse.json(
        { error: "Target URL is required" },
        { status: 400 }
      );
    }

    // Security check - only allow specific domains
    const allowedDomains = [
      'api.vapi.ai',
      'api.openai.com',
      'n8n.kendev.co',
      'api.google.com',
      'googleapis.com',
      'calendar.google.com',
      'gmail.googleapis.com'
    ];

    const urlDomain = new URL(targetUrl).hostname;
    if (!allowedDomains.some(domain => urlDomain.includes(domain))) {
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 }
      );
    }

    // Prepare headers with CORS
    const proxyHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    };

    // Add authentication if available
    if (process.env.VAPI_API_KEY && urlDomain.includes('vapi.ai')) {
      proxyHeaders['Authorization'] = `Bearer ${process.env.VAPI_API_KEY}`;
    }

    const response = await fetch(targetUrl, {
      method,
      headers: proxyHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json();

    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "VAPI CORS Proxy Active",
    allowedDomains: [
      'api.vapi.ai',
      'api.openai.com', 
      'n8n.kendev.co',
      'api.google.com',
      'googleapis.com'
    ],
    timestamp: new Date().toISOString()
  });
} 