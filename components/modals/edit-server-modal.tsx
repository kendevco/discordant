// src/components/modals/edit-server-modal.tsx
"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import CustomPopup from "@/components/custom-popup";
import { Settings, Workflow, Bot, AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
  workflowEnabled: z.boolean().default(true),
  selectedWorkflow: z.string().optional(),
});

// Mock workflows with message pattern detection
const availableWorkflows = [
  {
    id: "enhanced-ai-agent-v3",
    name: "Enhanced AI Agent v3.0",
    description: "Advanced business intelligence with message pattern support",
    hasMessagePattern: true,
    categories: ["AI", "Business Intelligence", "Research"]
  },
  {
    id: "document-processor",
    name: "Document Processing Workflow",
    description: "PDF/Image processing with OCR and analysis",
    hasMessagePattern: true,
    categories: ["Document Processing", "OCR"]
  },
  {
    id: "market-research-bot",
    name: "Market Research Assistant", 
    description: "Automated market analysis and reporting",
    hasMessagePattern: true,
    categories: ["Research", "Market Analysis"]
  },
  {
    id: "customer-support-ai",
    name: "Customer Support AI",
    description: "Intelligent customer service automation",
    hasMessagePattern: false,
    categories: ["Support", "Automation"]
  },
  {
    id: "data-visualization",
    name: "Data Visualization Engine",
    description: "Creates charts and visual reports from data",
    hasMessagePattern: false,
    categories: ["Visualization", "Data"]
  }
];

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [availableWorkflowsList, setAvailableWorkflowsList] = useState(availableWorkflows);
  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      workflowEnabled: true,
      selectedWorkflow: "none",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl || "");
      // Set defaults for workflow settings
      form.setValue("workflowEnabled", server.workflowEnabled ?? true);
      form.setValue("selectedWorkflow", server.selectedWorkflow || "none");
    }
  }, [server, form]);

  const selectedWorkflowId = form.watch("selectedWorkflow");
  const workflowEnabled = form.watch("workflowEnabled");
  const selectedWorkflow = selectedWorkflowId && selectedWorkflowId !== "none" 
    ? availableWorkflowsList.find(w => w.id === selectedWorkflowId)
    : null;

  // Filter workflows to show only those with message patterns
  const messagePatternWorkflows = availableWorkflowsList.filter(w => w.hasMessagePattern);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      form.reset();
      onClose();
      router.refresh();
      setTimeout(() => {
        setIsPopupOpen(true);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] text-black p-0 overflow-hidden max-h-[85vh] flex flex-col">
          <DialogHeader className="pt-8 px-6 flex-shrink-0">
            <DialogTitle className="text-4xl text-center font-bold text-zinc-200 mb-3 flex items-center justify-center gap-3">
              <Settings className="w-8 h-8" />
              Server Settings
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Configure your server settings, appearance, and automation workflows
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
              <div 
                className="flex-1 overflow-y-auto px-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/40"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                }}
              >
                <div className="space-y-8 py-6">
                  {/* Server Basic Settings */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Basic Settings</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Configure your server name and appearance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-center text-center">
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileUpload
                                  endpoint="serverImage"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-300">
                              Server name
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                className="bg-zinc-700/50 border-0 focus-visible:ring-0 text-zinc-200 focus-visible:ring-offset-0"
                                placeholder="Enter a server name"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-zinc-400">
                              This is the name of your server
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Automation Workflow Settings */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        AI Automation Settings
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Configure n8n workflow automation for intelligent message processing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="workflowEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-zinc-200">
                                Enable Workflow Automation
                              </FormLabel>
                              <FormDescription className="text-zinc-400">
                                Allow AI workflows to process messages in this server
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {workflowEnabled && (
                        <FormField
                          control={form.control}
                          name="selectedWorkflow"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-xs font-bold text-zinc-300">
                                Select Workflow
                              </FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                                disabled={isLoading}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-zinc-700/50 border-white/10 text-zinc-200">
                                    <SelectValue placeholder="Choose a workflow..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-zinc-800 border-white/10">
                                  <SelectItem value="none" className="text-zinc-300">
                                    No workflow selected
                                  </SelectItem>
                                  {messagePatternWorkflows.map((workflow) => (
                                    <SelectItem key={workflow.id} value={workflow.id} className="text-zinc-300">
                                      <div className="flex items-center gap-2">
                                        <Workflow className="w-4 h-4" />
                                        {workflow.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-zinc-400">
                                Only workflows with message pattern support are shown
                              </FormDescription>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Workflow Preview */}
                      {selectedWorkflow && workflowEnabled && (
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/10">
                          <h4 className="text-zinc-200 font-semibold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Selected Workflow
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-300">{selectedWorkflow.name}</span>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                Message Pattern Supported
                              </Badge>
                            </div>
                            <p className="text-zinc-400 text-sm">{selectedWorkflow.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedWorkflow.categories.map((category) => (
                                <Badge key={category} variant="outline" className="text-xs text-zinc-400 border-white/20">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {!workflowEnabled && (
                        <div className="bg-zinc-800/30 p-4 rounded-lg border border-white/10 text-center">
                          <Bot className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                          <p className="text-zinc-400">Workflow automation is disabled</p>
                          <p className="text-zinc-500 text-sm">Enable automation to configure n8n workflows</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <DialogFooter className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] px-6 py-4 flex-shrink-0 border-t border-white/10">
                <Button
                  variant="primary"
                  disabled={isLoading}
                  type="submit"
                >
                  Save Settings
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <CustomPopup
        isOpen={isPopupOpen}
        message="Server settings saved successfully!"
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
};
