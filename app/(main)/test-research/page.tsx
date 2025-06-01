"use client";

import { useState } from "react";
import { ResearchAgent } from "@/lib/system/research-agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RichContentRenderer } from "@/components/chat/rich-content-renderer";

export default function TestResearchPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testUrl = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      console.log("Testing URL:", url);
      
      // Test URL detection
      const shouldResearch = ResearchAgent.shouldResearch(url);
      console.log("Should research:", shouldResearch);
      
      if (shouldResearch) {
        const urls = ResearchAgent.extractUrls(url);
        console.log("Extracted URLs:", urls);
        
        const researchResults = await ResearchAgent.researchUrls(urls);
        console.log("Research results:", researchResults);
        
        const formatted = ResearchAgent.formatForChat(researchResults);
        console.log("Formatted results:", formatted);
        
        setResults({
          shouldResearch,
          urls,
          researchResults,
          formatted
        });
      } else {
        setResults({
          shouldResearch,
          urls: [],
          researchResults: [],
          formatted: "No research needed for this content."
        });
      }
    } catch (error) {
      console.error("Test error:", error);
      setResults({
        error: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUrls = [
    "https://openai.com",
    "https://anthropic.com",
    "https://github.com/microsoft/TypeScript",
    "https://nextjs.org",
    "https://vercel.com/company",
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Research Agent Test</CardTitle>
            <CardDescription>
              Test the URL research functionality that automatically analyzes company websites and URLs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a URL or message with URLs to test..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testUrl} disabled={!url || isLoading}>
                {isLoading ? "Researching..." : "Test URL"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Test URLs:</p>
              <div className="flex flex-wrap gap-2">
                {testUrls.map((testUrl) => (
                  <Button
                    key={testUrl}
                    variant="outline"
                    size="sm"
                    onClick={() => setUrl(testUrl)}
                    className="text-xs"
                  >
                    {testUrl.replace("https://", "")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Research Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.error ? (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded">
                  <p className="text-red-700 dark:text-red-300">Error: {results.error}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Should Research:</strong> {results.shouldResearch ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>URLs Found:</strong> {results.urls?.length || 0}
                    </div>
                  </div>
                  
                  {results.urls && results.urls.length > 0 && (
                    <div>
                      <strong>Extracted URLs:</strong>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {results.urls.map((url: string, i: number) => (
                          <li key={i} className="break-all">{url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.researchResults && results.researchResults.length > 0 && (
                    <div>
                      <strong>Raw Research Data:</strong>
                      <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                        {JSON.stringify(results.researchResults, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {results.formatted && (
                    <div>
                      <strong>Formatted for Chat:</strong>
                      <div className="mt-2 p-4 bg-zinc-900/50 dark:bg-zinc-800/50 rounded-lg border-l-4 border-blue-500">
                        <RichContentRenderer 
                          content={results.formatted} 
                          isSystemMessage={true}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Usage in Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you paste a URL into any chat channel, the system will automatically:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>Detect if the URL looks like a company or business website</li>
              <li>Fetch the webpage and extract metadata</li>
              <li>Identify if it's a company and extract business information</li>
              <li>Format and display the research results in chat</li>
              <li>Show title, description, location, and confidence rating</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 