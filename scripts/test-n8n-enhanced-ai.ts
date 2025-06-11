#!/usr/bin/env ts-node

/**
 * Automated Test Suite for Enhanced Business Intelligence AI Agent v5.6
 * Tests the workflow with comprehensive scenarios and performance monitoring
 * 
 * Usage:
 *   npm run test:n8n
 *   npx ts-node scripts/test-n8n-enhanced-ai.ts
 *   npx ts-node scripts/test-n8n-enhanced-ai.ts --mode webhook --verbose
 */

import { n8nApi, N8NTestData, N8NTestResult } from '../lib/services/n8n-api-client';
import * as fs from 'fs';
import * as path from 'path';

interface TestCase {
  name: string;
  description: string;
  inputData: any;
  expectedBehavior: string;
  timeout?: number;
  category: 'chat' | 'webhook' | 'vapi' | 'external' | 'calendar' | 'search' | 'research';
}

interface TestSuite {
  name: string;
  workflowId: string;
  webhookPath: string;
  testCases: TestCase[];
}

interface TestResults {
  suite: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  duration: number;
  results: Array<{
    testCase: string;
    success: boolean;
    duration: number;
    response?: any;
    error?: string;
  }>;
}

// Test configuration
const TEST_CONFIG = {
  // From your workflow JSON
  WORKFLOW_ID: '682X4GL9tCMoEiF5', // Enhanced Business Intelligence AI Agent
  WEBHOOK_PATH: 'discordant-ai-services',
  
  // Test timeouts
  DEFAULT_TIMEOUT: 60000, // 60 seconds
  LONG_TIMEOUT: 120000,   // 2 minutes for complex operations
  
  // Test modes
  USE_WEBHOOK: process.argv.includes('--webhook') || process.argv.includes('--mode=webhook'),
  VERBOSE: process.argv.includes('--verbose') || process.argv.includes('-v'),
  SAVE_RESULTS: !process.argv.includes('--no-save'),
};

// Comprehensive test suite
const testSuite: TestSuite = {
  name: 'Enhanced Business Intelligence AI Agent v5.6',
  workflowId: TEST_CONFIG.WORKFLOW_ID,
  webhookPath: TEST_CONFIG.WEBHOOK_PATH,
  testCases: [
    // Basic functionality tests
    {
      name: 'Basic Chat Response',
      description: 'Tests basic AI response via chat interface',
      inputData: N8NTestData.enhancedAI.chatTest('Hello! Can you confirm you are working properly?'),
      expectedBehavior: 'Should return friendly AI response confirming functionality',
      category: 'chat'
    },
    {
      name: 'System Message Test',
      description: 'Tests system message channel routing',
      inputData: N8NTestData.enhancedAI.chatTest('Hello System! Please confirm system status.'),
      expectedBehavior: 'Should route to sys-system-messages channel and respond',
      category: 'chat'
    },
    {
      name: 'Webhook Integration Test',
      description: 'Tests webhook integration from Discordant',
      inputData: N8NTestData.enhancedAI.webhookTest(
        'Testing webhook integration with Enhanced AI Agent v5.6',
        '51f79735-dd39-46b5-a162-d59fe5f7c9fc', // Existing channel
        'a90f1d41-12a9-4586-b9a4-a513d3bd01d9'  // System server
      ),
      expectedBehavior: 'Should process webhook and return AI response',
      category: 'webhook'
    },

    // Calendar functionality tests
    {
      name: 'Calendar View Request',
      description: 'Tests calendar viewing functionality',
      inputData: N8NTestData.enhancedAI.chatTest('Show me my calendar for this week'),
      expectedBehavior: 'Should call View_Calendar_Events tool and return calendar data',
      category: 'calendar',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },
    {
      name: 'Event Search Test',
      description: 'Tests smart event searching',
      inputData: N8NTestData.enhancedAI.chatTest('Find meetings scheduled for tomorrow'),
      expectedBehavior: 'Should use Smart_Event_Search tool to find specific events',
      category: 'calendar',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },
    {
      name: 'New Event Creation',
      description: 'Tests calendar event creation',
      inputData: N8NTestData.enhancedAI.chatTest('Schedule a test meeting for tomorrow at 2 PM titled "N8N Test Meeting"'),
      expectedBehavior: 'Should use Create_New_Event tool to schedule the meeting',
      category: 'calendar',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },

    // Search functionality tests
    {
      name: 'Message Search Test',
      description: 'Tests database message searching',
      inputData: N8NTestData.enhancedAI.chatTest('Search for recent messages about "n8n workflow"'),
      expectedBehavior: 'Should use Enhanced_MySQL_Search tool to find messages',
      category: 'search'
    },
    {
      name: 'Image Search Test',
      description: 'Tests image-only message searching',
      inputData: N8NTestData.enhancedAI.chatTest('Find recent images uploaded to the channel'),
      expectedBehavior: 'Should use Enhanced_MySQL_Search_Images_Only tool',
      category: 'search'
    },

    // Research functionality tests
    {
      name: 'Web Research Test',
      description: 'Tests Tavily AI web research',
      inputData: N8NTestData.enhancedAI.chatTest('Research the current weather in Clearwater, FL'),
      expectedBehavior: 'Should use Tavily_AI_Tool for web research',
      category: 'research',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },
    {
      name: 'GSA Research Test',
      description: 'Tests GSA client research functionality',
      inputData: N8NTestData.enhancedAI.chatTest('Research Microsoft Corporation for GSA qualification'),
      expectedBehavior: 'Should use GSA Client Research Tool for analysis',
      category: 'research',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },

    // Email functionality tests
    {
      name: 'Gmail Send Test',
      description: 'Tests Gmail sending capability',
      inputData: N8NTestData.enhancedAI.chatTest('Send a test email to kenneth.courtney@gmail.com with subject "N8N Test" and message "This is a test from the Enhanced AI Agent"'),
      expectedBehavior: 'Should use Gmail tool to send email',
      category: 'external',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },

    // YouTube functionality tests
    {
      name: 'YouTube Analysis Test',
      description: 'Tests YouTube transcript extraction',
      inputData: N8NTestData.enhancedAI.chatTest('Analyze this YouTube video: https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      expectedBehavior: 'Should use YouTube_Execute_Workflow tool for transcript analysis',
      category: 'research',
      timeout: TEST_CONFIG.LONG_TIMEOUT
    },

    // Error handling tests
    {
      name: 'Invalid Input Test',
      description: 'Tests error handling with invalid input',
      inputData: { invalid: 'data', structure: 'test' },
      expectedBehavior: 'Should handle gracefully and return error response',
      category: 'chat'
    },
    {
      name: 'Empty Message Test',
      description: 'Tests handling of empty messages',
      inputData: N8NTestData.enhancedAI.chatTest(''),
      expectedBehavior: 'Should handle empty input gracefully',
      category: 'chat'
    },

    // Performance tests
    {
      name: 'Large Context Test',
      description: 'Tests performance with large conversation context',
      inputData: N8NTestData.enhancedAI.webhookTest(
        'This is a test with large context. ' + 'Lorem ipsum dolor sit amet, '.repeat(100),
        'test-large-context-' + Date.now()
      ),
      expectedBehavior: 'Should handle large context efficiently',
      category: 'webhook'
    },

    // VAPI integration tests
    {
      name: 'VAPI Integration Test',
      description: 'Tests VAPI platform integration',
      inputData: N8NTestData.enhancedAI.vapiTest('Testing VAPI integration with Enhanced AI Agent'),
      expectedBehavior: 'Should route to sys-vapi-calls channel and process correctly',
      category: 'vapi'
    },

    // External API tests
    {
      name: 'External API Test',
      description: 'Tests external API platform integration',
      inputData: N8NTestData.enhancedAI.externalTest('Testing external API integration'),
      expectedBehavior: 'Should route to sys-external-api channel and process correctly',
      category: 'external'
    }
  ]
};

// Utility functions
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

function logWithTimestamp(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'): void {
  const timestamp = new Date().toISOString();
  const emoji = level === 'INFO' ? '📊' : level === 'WARN' ? '⚠️' : '❌';
  console.log(`${emoji} [${timestamp}] ${message}`);
}

function logVerbose(message: string): void {
  if (TEST_CONFIG.VERBOSE) {
    logWithTimestamp(message);
  }
}

// Main test execution
async function runTestCase(testCase: TestCase, useWebhook: boolean): Promise<N8NTestResult> {
  logVerbose(`Starting test: ${testCase.name}`);
  logVerbose(`Input data: ${JSON.stringify(testCase.inputData, null, 2)}`);

  try {
    if (useWebhook) {
      return await n8nApi.executeViaWebhook(
        testSuite.webhookPath,
        testCase.inputData,
        { timeout: testCase.timeout || TEST_CONFIG.DEFAULT_TIMEOUT }
      );
    } else {
      return await n8nApi.executeWorkflow(
        testSuite.workflowId,
        testCase.inputData,
        { timeout: testCase.timeout || TEST_CONFIG.DEFAULT_TIMEOUT }
      );
    }
  } catch (error) {
    logWithTimestamp(`Test execution error: ${error}`, 'ERROR');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: 0,
      timestamp: new Date().toISOString()
    };
  }
}

async function runTestSuite(): Promise<TestResults> {
  const startTime = Date.now();
  const useWebhook = TEST_CONFIG.USE_WEBHOOK;
  
  logWithTimestamp(`🚀 Starting test suite: ${testSuite.name}`);
  logWithTimestamp(`📡 Mode: ${useWebhook ? 'Webhook' : 'API'}`);
  logWithTimestamp(`🧪 Total tests: ${testSuite.testCases.length}`);
  
  if (useWebhook) {
    logWithTimestamp(`🌐 Webhook URL: ${n8nApi['webhookBaseUrl']}/${testSuite.webhookPath}`);
  } else {
    logWithTimestamp(`🔑 API URL: ${n8nApi['baseUrl']}/workflows/${testSuite.workflowId}`);
  }

  const results: TestResults = {
    suite: testSuite.name,
    timestamp: new Date().toISOString(),
    totalTests: testSuite.testCases.length,
    passed: 0,
    failed: 0,
    duration: 0,
    results: []
  };

  // Run tests sequentially to avoid overwhelming the workflow
  for (let i = 0; i < testSuite.testCases.length; i++) {
    const testCase = testSuite.testCases[i];
    const testNumber = i + 1;
    
    logWithTimestamp(`🧪 Test ${testNumber}/${testSuite.testCases.length}: ${testCase.name}`);
    
    const testResult = await runTestCase(testCase, useWebhook);
    
    if (testResult.success) {
      results.passed++;
      logWithTimestamp(`✅ PASS - ${testCase.name} (${formatDuration(testResult.duration)})`);
      
      if (TEST_CONFIG.VERBOSE && testResult.response) {
        logVerbose(`Response preview: ${JSON.stringify(testResult.response, null, 2).substring(0, 200)}...`);
      }
    } else {
      results.failed++;
      logWithTimestamp(`❌ FAIL - ${testCase.name} - ${testResult.error}`, 'ERROR');
    }

    results.results.push({
      testCase: testCase.name,
      success: testResult.success,
      duration: testResult.duration,
      response: testResult.response,
      error: testResult.error
    });

    // Brief pause between tests to avoid rate limiting
    if (i < testSuite.testCases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  results.duration = Date.now() - startTime;
  
  return results;
}

function generateReport(results: TestResults): void {
  logWithTimestamp('📊 TEST SUITE COMPLETE');
  console.log('\n' + '='.repeat(60));
  console.log(`📈 ENHANCED AI AGENT v5.6 TEST RESULTS`);
  console.log('='.repeat(60));
  console.log(`🕐 Duration: ${formatDuration(results.duration)}`);
  console.log(`📊 Total Tests: ${results.totalTests}`);
  console.log(`✅ Passed: ${results.passed} (${((results.passed / results.totalTests) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed} (${((results.failed / results.totalTests) * 100).toFixed(1)}%)`);
  console.log('');

  // Detailed results
  console.log('📋 DETAILED RESULTS:');
  console.log('-'.repeat(60));
  
  for (const result of results.results) {
    const status = result.success ? '✅' : '❌';
    const duration = formatDuration(result.duration);
    console.log(`${status} ${result.testCase.padEnd(40)} ${duration.padStart(8)}`);
    
    if (!result.success && result.error) {
      console.log(`    Error: ${result.error}`);
    }
  }

  console.log('\n' + '='.repeat(60));

  // Performance summary
  const avgDuration = results.results.reduce((sum, r) => sum + r.duration, 0) / results.results.length;
  const maxDuration = Math.max(...results.results.map(r => r.duration));
  const minDuration = Math.min(...results.results.map(r => r.duration));

  console.log('⚡ PERFORMANCE SUMMARY:');
  console.log(`📊 Average Response Time: ${formatDuration(avgDuration)}`);
  console.log(`🔺 Slowest Test: ${formatDuration(maxDuration)}`);
  console.log(`🔻 Fastest Test: ${formatDuration(minDuration)}`);

  // Category breakdown
  const categories = [...new Set(testSuite.testCases.map(tc => tc.category))];
  console.log('\n📂 CATEGORY BREAKDOWN:');
  
  for (const category of categories) {
    const categoryTests = results.results.filter((_, i) => testSuite.testCases[i].category === category);
    const categoryPassed = categoryTests.filter(r => r.success).length;
    const categoryTotal = categoryTests.length;
    const categoryPercent = ((categoryPassed / categoryTotal) * 100).toFixed(1);
    
    console.log(`${category.padEnd(15)} ${categoryPassed}/${categoryTotal} (${categoryPercent}%)`);
  }
}

async function saveResults(results: TestResults): Promise<void> {
  if (!TEST_CONFIG.SAVE_RESULTS) return;

  try {
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `n8n-enhanced-ai-${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    logWithTimestamp(`💾 Results saved to: ${filepath}`);
  } catch (error) {
    logWithTimestamp(`Failed to save results: ${error}`, 'ERROR');
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    logWithTimestamp('🎯 Enhanced Business Intelligence AI Agent Test Suite');
    logWithTimestamp('📁 Version: 5.6 (correcting version mismatch from filename v5.5)');
    
    // Check environment
    if (!process.env.N8N_WEBHOOK_URL && !process.env.N8N_API_KEY) {
      logWithTimestamp('⚠️ No N8N_WEBHOOK_URL or N8N_API_KEY found in environment', 'WARN');
      logWithTimestamp('⚠️ Some tests may fail without proper configuration', 'WARN');
    }

    const results = await runTestSuite();
    generateReport(results);
    await saveResults(results);

    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
    
  } catch (error) {
    logWithTimestamp(`Fatal error: ${error}`, 'ERROR');
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { testSuite, runTestSuite, generateReport }; 