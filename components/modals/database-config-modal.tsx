"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseDatabaseUrl, formatDatabaseUrl, type DatabaseConfig } from "@/lib/utils/database-url-parser";

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDatabaseUrl?: string;
  onSave?: (config: DatabaseConfig, formattedUrl: string) => void;
}

export const DatabaseConfigModal = ({
  isOpen,
  onClose,
  initialDatabaseUrl = "",
  onSave
}: DatabaseConfigModalProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<DatabaseConfig>({
    protocol: "mysql",
    username: "",
    password: "",
    host: "",
    port: 3306,
    database: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rawUrl, setRawUrl] = useState(initialDatabaseUrl);

  useEffect(() => {
    if (initialDatabaseUrl) {
      const parsed = parseDatabaseUrl(initialDatabaseUrl);
      if (parsed) {
        setConfig(parsed);
      }
      setRawUrl(initialDatabaseUrl);
    }
  }, [initialDatabaseUrl]);

  const handleConfigChange = (field: keyof DatabaseConfig, value: string | number) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    setRawUrl(formatDatabaseUrl(newConfig));
  };

  const handleRawUrlChange = (url: string) => {
    setRawUrl(url);
    const parsed = parseDatabaseUrl(url);
    if (parsed) {
      setConfig(parsed);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Database URL has been copied to your clipboard.",
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(config, rawUrl);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Database Connection Settings</DialogTitle>
          <DialogDescription>
            Configure your database connection. You can edit individual fields or paste a complete URL.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Raw URL Input */}
          <div className="space-y-2">
            <Label htmlFor="raw-url">Database URL</Label>
            <div className="flex gap-2">
              <Input
                id="raw-url"
                value={rawUrl}
                onChange={(e) => handleRawUrlChange(e.target.value)}
                placeholder="mysql://username:password@host:port/database"
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(rawUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Individual Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Input
                id="protocol"
                value={config.protocol}
                onChange={(e) => handleConfigChange("protocol", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) => handleConfigChange("port", parseInt(e.target.value) || 3306)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              value={config.host}
              onChange={(e) => handleConfigChange("host", e.target.value)}
              placeholder="localhost or kendev.co"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleConfigChange("username", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={config.password}
                  onChange={(e) => handleConfigChange("password", e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database Name</Label>
            <Input
              id="database"
              value={config.database}
              onChange={(e) => handleConfigChange("database", e.target.value)}
            />
          </div>

          {/* Connection Preview */}
          <div className="p-3 bg-muted rounded-md">
            <Label className="text-sm font-medium text-muted-foreground">Connection Preview:</Label>
            <p className="font-mono text-sm mt-1 break-all">
              {config.protocol}://{config.username}:{"*".repeat(config.password.length)}@{config.host}:{config.port}/{config.database}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 