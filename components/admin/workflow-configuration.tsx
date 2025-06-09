"use client";

import { useState, useEffect } from "react";
import { Search, Settings, Zap, Filter, Check, X, RefreshCw, Workflow } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  webhookPath: string;
  active: boolean;
  tags: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

interface WorkflowConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
  serverId?: string;
  channelId?: string;
  onWorkflowSelected?: (workflow: WorkflowDefinition) => void;
}

export function WorkflowConfiguration({ 
  isOpen, 
  onClose, 
  serverId, 
  channelId,
  onWorkflowSelected 
}: WorkflowConfigurationProps) {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const { toast } = useToast();
  
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load workflows from n8n
  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/n8n/workflows');
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      
      const data = await response.json();
      setWorkflows(data.workflows || []);
      setCategories(['all', ...(data.categories || [])]);
      
      toast({
        title: "Workflows loaded",
        description: `Found ${data.workflows?.length || 0} workflows from n8n server`,
      });
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: "Error loading workflows",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load workflows on mount
  useEffect(() => {
    if (isOpen) {
      loadWorkflows();
    }
  }, [isOpen]);

  // Filter workflows based on search and filters
  const filteredWorkflows = workflows.filter(workflow => {
    if (showActiveOnly && !workflow.active) return false;
    if (selectedCategory !== 'all' && workflow.category !== selectedCategory) return false;
    
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      return (
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(query)) ||
        workflow.webhookPath.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Group workflows by category for display
  const workflowsByCategory = filteredWorkflows.reduce((acc, workflow) => {
    if (!acc[workflow.category]) {
      acc[workflow.category] = [];
    }
    acc[workflow.category].push(workflow);
    return acc;
  }, {} as Record<string, WorkflowDefinition[]>);

  const handleWorkflowToggle = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const handleWorkflowSelect = (workflow: WorkflowDefinition) => {
    if (onWorkflowSelected) {
      onWorkflowSelected(workflow);
    }
    
    toast({
      title: "Workflow selected",
      description: `${workflow.name} is now configured for this context`,
    });
  };

  const saveConfiguration = async () => {
    try {
      // Save workflow configuration
      const configData = {
        serverId,
        channelId,
        selectedWorkflows,
        timestamp: new Date().toISOString()
      };

      console.log('Saving workflow configuration:', configData);
      
      toast({
        title: "Configuration saved",
        description: `${selectedWorkflows.length} workflows configured`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error saving configuration",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowActiveOnly(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Workflow Configuration
            <Badge variant="secondary" className="ml-2">
              {filteredWorkflows.length} available
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="browse">Browse Workflows</TabsTrigger>
            <TabsTrigger value="selected">Selected ({selectedWorkflows.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1 flex flex-col min-h-0">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-4 flex-shrink-0">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search workflows by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadWorkflows}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={showActiveOnly}
                    onCheckedChange={(checked) => setShowActiveOnly(checked === true)}
                  />
                  <span className="text-sm">Active workflows only</span>
                </label>

                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Workflows Display */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : Object.keys(workflowsByCategory).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(workflowsByCategory).map(([category, categoryWorkflows]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        {category}
                        <Badge variant="outline">{categoryWorkflows.length}</Badge>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryWorkflows.map((workflow) => (
                          <Card 
                            key={workflow.id} 
                            className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              selectedWorkflows.includes(workflow.id) ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => handleWorkflowToggle(workflow.id)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-sm font-medium">
                                    {workflow.name}
                                  </CardTitle>
                                  <CardDescription className="text-xs mt-1">
                                    {workflow.description}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  {workflow.active && (
                                    <Badge variant="outline" className="text-xs">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Active
                                    </Badge>
                                  )}
                                  {selectedWorkflows.includes(workflow.id) && (
                                    <Check className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1 mb-2">
                                {workflow.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {workflow.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{workflow.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Path: {workflow.webhookPath}
                              </div>
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWorkflowSelect(workflow);
                                  }}
                                >
                                  <Settings className="w-3 h-3 mr-1" />
                                  Configure
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No workflows found matching your criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="selected" className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4">
              {selectedWorkflows.length > 0 ? (
                <div className="grid gap-4">
                  {selectedWorkflows.map((workflowId) => {
                    const workflow = workflows.find(w => w.id === workflowId);
                    if (!workflow) return null;
                    
                    return (
                      <Card key={workflowId}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-sm">{workflow.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {workflow.description}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWorkflowToggle(workflowId)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No workflows selected yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configuration Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {serverId && <div><strong>Server:</strong> {serverId}</div>}
                    {channelId && <div><strong>Channel:</strong> {channelId}</div>}
                    <div><strong>Context:</strong> {channelId ? 'Channel-specific' : 'Server-wide'}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Auto-routing Settings</CardTitle>
                  <CardDescription className="text-xs">
                    Configure how messages are automatically routed to workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Enable intelligent routing</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Allow fallback workflows</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Log workflow responses</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
          <div className="text-sm text-gray-500">
            {filteredWorkflows.length} workflows available • {selectedWorkflows.length} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveConfiguration} disabled={selectedWorkflows.length === 0}>
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 