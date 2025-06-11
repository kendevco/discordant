import { NextApiRequest } from "next";

/**
 * Dynamically detects the server's running configuration
 * Returns the actual URL the server is accessible on
 */
export function getServerUrl(req?: NextApiRequest): string {
  // If we have a request, use its headers to determine the actual URL
  if (req) {
    const protocol = req.headers['x-forwarded-proto'] || 
                    (req.connection as any)?.encrypted ? 'https' : 'http';
    const host = req.headers['x-forwarded-host'] || 
                req.headers.host;
    
    if (host) {
      const serverUrl = `${protocol}://${host}`;
      console.log(`[SERVER_CONFIG] Detected server URL from request: ${serverUrl}`);
      return serverUrl;
    }
  }
  
  // Fallback to environment variables or defaults
  if (process.env.NEXT_PUBLIC_APP_URL) {
    console.log(`[SERVER_CONFIG] Using NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL}`);
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Production vs development defaults
  const defaultUrl = process.env.NODE_ENV === 'production' 
    ? "https://discordant.kendev.co" 
    : "https://localhost:3000";
    
  console.log(`[SERVER_CONFIG] Using default URL: ${defaultUrl}`);
  return defaultUrl;
}

/**
 * Gets the workflow proxy URL using dynamic server detection
 */
export function getWorkflowProxyUrl(req?: NextApiRequest): string {
  const baseUrl = getServerUrl(req);
  const proxyUrl = `${baseUrl}/api/workflow`;
  console.log(`[SERVER_CONFIG] Workflow proxy URL: ${proxyUrl}`);
  return proxyUrl;
}

/**
 * Detects if server is running with HTTPS
 */
export function isHttpsServer(req?: NextApiRequest): boolean {
  if (req) {
    const protocol = req.headers['x-forwarded-proto'] || 
                    (req.connection as any)?.encrypted ? 'https' : 'http';
    return protocol === 'https';
  }
  
  // Check if we're in a known HTTPS environment
  return process.env.NODE_ENV === 'production' || 
         process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://') ||
         false;
}

/**
 * Gets the actual port the server is running on
 */
export function getServerPort(req?: NextApiRequest): string | number {
  if (req?.headers.host) {
    const host = req.headers.host;
    const portMatch = host.match(/:(\d+)$/);
    if (portMatch) {
      const port = parseInt(portMatch[1]);
      console.log(`[SERVER_CONFIG] Detected port from host header: ${port}`);
      return port;
    }
  }
  
  // Try to detect from common environment variables
  const envPort = process.env.PORT || process.env.NEXT_PUBLIC_PORT;
  if (envPort) {
    console.log(`[SERVER_CONFIG] Using environment port: ${envPort}`);
    return parseInt(envPort);
  }
  
  // Default ports
  const defaultPort = process.env.NODE_ENV === 'production' ? 80 : 3000;
  console.log(`[SERVER_CONFIG] Using default port: ${defaultPort}`);
  return defaultPort;
} 