export interface DatabaseConfig {
  protocol: string;
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export function parseDatabaseUrl(databaseUrl: string): DatabaseConfig | null {
  try {
    // Remove quotes if present
    const cleanUrl = databaseUrl.replace(/['"]/g, '');
    
    // Parse the URL
    const url = new URL(cleanUrl);
    
    return {
      protocol: url.protocol.replace(':', ''),
      username: url.username,
      password: url.password,
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      database: url.pathname.substring(1) // Remove leading slash
    };
  } catch (error) {
    console.error('Failed to parse database URL:', error);
    return null;
  }
}

export function formatDatabaseUrl(config: DatabaseConfig): string {
  return `${config.protocol}://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

// Example usage:
// const config = parseDatabaseUrl("mysql://discordant:K3nD3v!discordant@kendev.co:3306/discordant");
// Result: {
//   protocol: "mysql",
//   username: "discordant", 
//   password: "K3nD3v!discordant",
//   host: "kendev.co",
//   port: 3306,
//   database: "discordant"
// } 