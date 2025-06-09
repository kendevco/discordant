"use client";

import { useState, useEffect } from "react";
import { Workflow, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  webhookPath: string;
  active: boolean;
  tags: string[];
  category: string;
}

interface QuickWorkflowSelectorProps {
  onWorkflowSelected: (workflow: WorkflowDefinition) => void;
  className?: string;
}

export function QuickWorkflowSelector({ 
  onWorkflowSelected,
  className = ""
}: QuickWorkflowSelectorProps) {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const { toast } = useToast();

  // Load featured workflows
  const loadFeaturedWorkflows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/n8n/workflows');
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      
      const data = await response.json();
      
      // Show only the top 6 most common workflows
      const featured = data.workflows?.slice(0, 6) || [];
      setWorkflows(featured);
      
    } catch (error) {
      console.error('Error loading workflows:', error);
      // Fallback to mock data for demo
      setWorkflows([
        {
          id: "general-assistant",
          name: "General Assistant",
          description: "Multi-purpose AI assistant",
          webhookPath: "assistant",
          active: true,
          tags: ["ai", "assistant"],
          category: "AI Agents"
        },
        {
          id: "file-processor",
          name: "File Processor",
          description: "AI-powered file analysis",
          webhookPath: "file-processor",
          active: true,
          tags: ["file", "ai"],
          category: "File Management"
        },
        {
          id: "calendar-integration",
          name: "Calendar",
          description: "Schedule management",
          webhookPath: "calendar",
          active: true,
          tags: ["calendar"],
          category: "Productivity"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedWorkflows();
  }, []);

  const handleWorkflowSelect = (workflow: WorkflowDefinition) => {
    setSelectedWorkflow(workflow.id);
    onWorkflowSelected(workflow);
    
    toast({
      title: "Workflow assigned",
      description: `${workflow.name} will handle this type of request`,
      duration: 3000,
    });

    // Clear selection after a moment
    setTimeout(() => {
      setSelectedWorkflow(null);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Workflow className="w-4 h-4" />
        <span className="text-sm font-medium">Quick Assign Workflow</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {workflows.map((workflow) => (
          <Card 
            key={workflow.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedWorkflow === workflow.id ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleWorkflowSelect(workflow)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {workflow.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {workflow.active && (
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-2 h-2 mr-1" />
                      Active
                    </Badge>
                  )}
                  {selectedWorkflow === workflow.id && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
              <CardDescription className="text-xs">
                {workflow.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {workflow.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {workflows.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No workflows available
        </div>
      )}
    </div>
  );
} 