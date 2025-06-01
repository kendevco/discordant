"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseConfigModal } from "@/components/modals/database-config-modal";
import { parseDatabaseUrl, type DatabaseConfig } from "@/lib/utils/database-url-parser";
import { Database, Settings } from "lucide-react";

export default function TestDatabaseConfigPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedConfig, setSavedConfig] = useState<DatabaseConfig | null>(null);
  const [savedUrl, setSavedUrl] = useState<string>("");

  // Example database URL from your request
  const exampleUrl = "mysql://discordant:K3nD3v!discordant@kendev.co:3306/discordant";

  const handleOpenModal = (url?: string) => {
    setSavedUrl(url || "");
    setIsModalOpen(true);
  };

  const handleSaveConfig = (config: DatabaseConfig, formattedUrl: string) => {
    setSavedConfig(config);
    setSavedUrl(formattedUrl);
    console.log("Saved database config:", config);
    console.log("Formatted URL:", formattedUrl);
  };

  // Parse the example URL to show extracted values
  const exampleConfig = parseDatabaseUrl(exampleUrl);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Database Configuration Test</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Example URL Parsing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              URL Parsing Example
            </CardTitle>
            <CardDescription>
              Extract values from your database URL string
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Original URL:</h4>
              <code className="text-sm bg-muted p-2 rounded block break-all">
                {exampleUrl}
              </code>
            </div>

            {exampleConfig && (
              <div>
                <h4 className="font-medium mb-2">Extracted Values:</h4>
                <div className="grid gap-2 text-sm">
                  <div><strong>Protocol:</strong> {exampleConfig.protocol}</div>
                  <div><strong>Username:</strong> {exampleConfig.username}</div>
                  <div><strong>Password:</strong> {"*".repeat(exampleConfig.password.length)} (hidden)</div>
                  <div><strong>Host:</strong> {exampleConfig.host}</div>
                  <div><strong>Port:</strong> {exampleConfig.port}</div>
                  <div><strong>Database:</strong> {exampleConfig.database}</div>
                </div>
              </div>
            )}

            <Button 
              onClick={() => handleOpenModal(exampleUrl)}
              className="w-full"
            >
              Edit in Dialog
            </Button>
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
            <CardDescription>
              Your saved database settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedConfig ? (
              <>
                <div className="grid gap-2 text-sm">
                  <div><strong>Protocol:</strong> {savedConfig.protocol}</div>
                  <div><strong>Username:</strong> {savedConfig.username}</div>
                  <div><strong>Password:</strong> {"*".repeat(savedConfig.password.length)} (hidden)</div>
                  <div><strong>Host:</strong> {savedConfig.host}</div>
                  <div><strong>Port:</strong> {savedConfig.port}</div>
                  <div><strong>Database:</strong> {savedConfig.database}</div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Generated URL:</h4>
                  <code className="text-sm bg-muted p-2 rounded block break-all">
                    {savedUrl}
                  </code>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                No configuration saved yet. Use the dialog to configure your database connection.
              </p>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={() => handleOpenModal()}
                variant="outline"
                className="flex-1"
              >
                New Config
              </Button>
              {savedConfig && (
                <Button 
                  onClick={() => handleOpenModal(savedUrl)}
                  className="flex-1"
                >
                  Edit Current
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            How to use the database URL parser in your code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Parsing a URL:</h4>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
{`import { parseDatabaseUrl } from "@/lib/utils/database-url-parser";

const config = parseDatabaseUrl("mysql://user:pass@host:3306/db");
// Returns: { protocol: "mysql", username: "user", password: "pass", ... }`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Building a URL:</h4>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
{`import { formatDatabaseUrl } from "@/lib/utils/database-url-parser";

const url = formatDatabaseUrl({
  protocol: "mysql",
  username: "user",
  password: "pass",
  host: "localhost",
  port: 3306,
  database: "mydb"
});
// Returns: "mysql://user:pass@localhost:3306/mydb"`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <DatabaseConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDatabaseUrl={savedUrl}
        onSave={handleSaveConfig}
      />
    </div>
  );
} 