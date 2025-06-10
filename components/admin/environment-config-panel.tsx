"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Key,
  Database,
  Cloud,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EnvironmentVariable {
  key: string;
  value: string;
  category: 'database' | 'auth' | 'integration' | 'storage' | 'api' | 'system';
  description: string;
  required: boolean;
  sensitive: boolean;
}

export function EnvironmentConfigPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
  const [showSensitive, setShowSensitive] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadEnvironmentConfig();
  }, []);

  const loadEnvironmentConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/host/environment');
      if (response.ok) {
        const data = await response.json();
        setEnvVars(data.variables || []);
      }
    } catch (error) {
      console.error('Failed to load environment config:', error);
      toast({
        title: "Error",
        description: "Failed to load environment configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEnvironmentConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/host/environment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables: envVars })
      });

      if (response.ok) {
        setHasChanges(false);
        toast({
          title: "Success",
          description: "Environment configuration saved successfully",
        });
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving environment config:', error);
      toast({
        title: "Error",
        description: "Failed to save environment configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateEnvVar = (key: string, value: string) => {
    setEnvVars(prev => prev.map(env => 
      env.key === key ? { ...env, value } : env
    ));
    setHasChanges(true);
  };

  const toggleSensitiveVisibility = (key: string) => {
    setShowSensitive(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Success",
      description: "Copied to clipboard",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'database': return 'bg-blue-100 text-blue-800';
      case 'auth': return 'bg-green-100 text-green-800';
      case 'integration': return 'bg-purple-100 text-purple-800';
      case 'storage': return 'bg-orange-100 text-orange-800';
      case 'api': return 'bg-red-100 text-red-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="w-4 h-4" />;
      case 'auth': return <Shield className="w-4 h-4" />;
      case 'integration': return <Server className="w-4 h-4" />;
      case 'storage': return <Cloud className="w-4 h-4" />;
      case 'api': return <Key className="w-4 h-4" />;
      case 'system': return <Server className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const groupedEnvVars = envVars.reduce((acc, envVar) => {
    if (!acc[envVar.category]) {
      acc[envVar.category] = [];
    }
    acc[envVar.category].push(envVar);
    return acc;
  }, {} as Record<string, EnvironmentVariable[]>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Server className="mr-2 h-6 w-6 text-blue-600" />
            Environment Configuration
          </h1>
          <p className="text-gray-600">Manage system environment variables and configuration</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={loadEnvironmentConfig} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={saveEnvironmentConfig}
            disabled={!hasChanges || saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <div className="text-yellow-800">
            You have unsaved changes. Remember to save your configuration.
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Variables</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {Object.entries(groupedEnvVars).map(([category, vars]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center capitalize">
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category} Configuration</span>
                  <Badge className={`ml-2 ${getCategoryColor(category)}`}>
                    {vars.length} variables
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vars.map((envVar) => (
                    <div key={envVar.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Label className="font-mono text-sm">{envVar.key}</Label>
                          {envVar.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                          {envVar.sensitive && (
                            <Badge variant="outline" className="text-xs">Sensitive</Badge>
                          )}
                        </div>
                        {envVar.value && (
                          <div className="flex space-x-1">
                            {envVar.sensitive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSensitiveVisibility(envVar.key)}
                              >
                                {showSensitive.has(envVar.key) ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(envVar.value)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{envVar.description}</p>
                        <div className="flex items-center space-x-2">
                          <Input
                            type={envVar.sensitive && !showSensitive.has(envVar.key) ? "password" : "text"}
                            value={envVar.value}
                            onChange={(e) => updateEnvVar(envVar.key, e.target.value)}
                            placeholder={`Enter ${envVar.key}`}
                            className="font-mono text-sm"
                          />
                          {envVar.value ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : envVar.required ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {Object.entries(groupedEnvVars).map(([category, vars]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center capitalize">
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category} Variables</span>
                  <Badge className={`ml-2 ${getCategoryColor(category)}`}>
                    {vars.length} variables
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Configure {category}-related environment variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vars.map((envVar) => (
                    <div key={envVar.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Label className="font-mono text-sm">{envVar.key}</Label>
                          {envVar.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                          {envVar.sensitive && (
                            <Badge variant="outline" className="text-xs">Sensitive</Badge>
                          )}
                        </div>
                        {envVar.value && (
                          <div className="flex space-x-1">
                            {envVar.sensitive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSensitiveVisibility(envVar.key)}
                              >
                                {showSensitive.has(envVar.key) ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(envVar.value)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{envVar.description}</p>
                        <div className="flex items-center space-x-2">
                          <Input
                            type={envVar.sensitive && !showSensitive.has(envVar.key) ? "password" : "text"}
                            value={envVar.value}
                            onChange={(e) => updateEnvVar(envVar.key, e.target.value)}
                            placeholder={`Enter ${envVar.key}`}
                            className="font-mono text-sm"
                          />
                          {envVar.value ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : envVar.required ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 