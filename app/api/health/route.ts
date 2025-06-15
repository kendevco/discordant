import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[HEALTH_CHECK] Starting health check...');
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      deployment: {
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'localhost'
      },
      database: {
        status: 'unknown',
        error: null
      },
      environment_variables: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        UPLOADTHING_SECRET: !!process.env.UPLOADTHING_SECRET,
        N8N_WEBHOOK_URL: !!process.env.N8N_WEBHOOK_URL,
        N8N_API_KEY: !!process.env.N8N_API_KEY
      },
      performance: {
        responseTime: 0,
        memoryUsage: process.memoryUsage()
      }
    };

    // Test database connection
    try {
      console.log('[HEALTH_CHECK] Testing database connection...');
      await db.$queryRaw`SELECT 1 as test`;
      healthData.database.status = 'connected';
      console.log('[HEALTH_CHECK] Database connection successful');
    } catch (dbError: any) {
      console.error('[HEALTH_CHECK] Database connection failed:', dbError.message);
      healthData.database.status = 'error';
      healthData.database.error = dbError.message;
      healthData.status = 'degraded';
    }

    // Calculate response time
    healthData.performance.responseTime = Date.now() - startTime;
    
    console.log('[HEALTH_CHECK] Health check completed:', {
      status: healthData.status,
      responseTime: healthData.performance.responseTime,
      dbStatus: healthData.database.status
    });

    return NextResponse.json(healthData, {
      status: healthData.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true'
      }
    });

  } catch (error: any) {
    console.error('[HEALTH_CHECK] Critical error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      performance: {
        responseTime: Date.now() - startTime
      }
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true'
      }
    });
  }
} 