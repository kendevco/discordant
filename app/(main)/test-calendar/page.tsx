"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarWebhookTester } from "@/lib/utils/test-calendar-webhook";
import { Send, Bot, User, Calendar, Clock } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  loading?: boolean;
}

export default function TestCalendarPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "👋 Hey there! I'm your calendar assistant. I can help you with things like:\n\n• Check what you have today or tomorrow\n• Show your weekly schedule\n• Find free time for meetings\n• Create or update events\n\nJust ask me naturally - no need for formal commands! 😊",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatFriendlyResponse = (rawMessage: string): string => {
    // Remove overly formal duty officer prefixes for a friendlier chat experience
    let friendly = rawMessage
      .replace(/📋 \*\*DUTY OFFICER - SCHEDULE REPORT\*\*:\s*/g, "📅 Here's what I found on your calendar:\n\n")
      .replace(/✅ \*\*DUTY OFFICER - EVENT SCHEDULED\*\*:\s*/g, "✅ Great! I've scheduled that for you:\n\n")
      .replace(/🔄 \*\*DUTY OFFICER - SCHEDULE UPDATED\*\*:\s*/g, "🔄 Perfect! I've updated your schedule:\n\n")
      .replace(/❌ \*\*DUTY OFFICER - EVENT CANCELLED\*\*:\s*/g, "❌ Done! I've cancelled that event:\n\n")
      .replace(/🕐 \*\*DUTY OFFICER - AVAILABILITY CHECK\*\*:\s*/g, "🕐 Let me check your availability:\n\n")
      .replace(/📅 \*\*DUTY OFFICER - CALENDAR RESPONSE\*\*:\s*/g, "📅 Here's what I found:\n\n");

    // Add friendly conversational touches
    if (friendly.includes("Here are your scheduled events")) {
      friendly = friendly.replace("Here are your scheduled events", "📋 I found these events");
    }
    
    // Make the closing more casual
    friendly = friendly
      .replace(/Would you like to add more details to these events or need information on anything else\? 😊/g, 
               "Need me to help with anything else? 😊")
      .replace(/Is there anything else you'd like me to help you with\?/g,
               "What else can I help you with?");

    return friendly;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "Thinking...",
      sender: 'bot',
      timestamp: new Date(),
      loading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const result = await CalendarWebhookTester.testCalendarMessage(inputMessage);
      
      // Remove loading message and add actual response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.loading);
        
        // Handle n8n array response format
        let botMessage = "I processed your request, but didn't receive a response.";
        
        if (result?.success && result?.response) {
          // Check if response has data array (current structure)
          if (result.response?.data && Array.isArray(result.response.data) && result.response.data.length > 0) {
            botMessage = result.response.data[0]?.message || "Response received but no message content found.";
          }
          // Check if response is an array (n8n format)
          else if (Array.isArray(result.response) && result.response.length > 0) {
            botMessage = result.response[0]?.message || "Response received but no message content found.";
          } 
          // Check if response has message directly
          else if (result.response?.message) {
            botMessage = result.response.message;
          }
          // Check if response is just a string
          else if (typeof result.response === 'string') {
            botMessage = result.response;
          }
          // Show the raw response structure for debugging
          else {
            botMessage = `🔍 **Debug Response:**\n\`\`\`json\n${JSON.stringify(result.response, null, 2)}\n\`\`\``;
          }
        } else if (result?.error) {
          botMessage = `❌ Error: ${result.error}`;
        }
        
        const botResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: formatFriendlyResponse(botMessage),
          sender: 'bot',
          timestamp: new Date()
        };
        
        // Add response time info if available
        if (result?.success && typeof result.responseTime === 'number') {
          botResponse.content += `\n\n*Response time: ${result.responseTime}ms*`;
        }
        
        return [...withoutLoading, botResponse];
      });
    } catch (error) {
      // Remove loading message and add error response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.loading);
        const errorResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`,
          sender: 'bot',
          timestamp: new Date()
        };
        return [...withoutLoading, errorResponse];
      });
    } finally {
      setIsLoading(false);
      // Focus back to input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What do I have today?",
    "Show me next week's events",
    "What's on my calendar tomorrow?",
    "Am I free this afternoon?",
    "Show me this week's schedule"
  ];

  const addQuickQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "👋 Chat cleared! How can I help you with your calendar?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-xl p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Calendar Assistant Test
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Testing n8n calendar integration
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  {message.loading ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              )}
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <Clock className="w-3 h-3 opacity-50" />
                  <span className="text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="bg-white dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => addQuickQuestion(question)}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-xl p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your calendar..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • Webhook: <code>https://n8n.kendev.co/webhook/google-ai-services</code>
          </div>
        </div>
      </div>
    </div>
  );
} 