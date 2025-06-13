"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error details for debugging
    console.group("🚨 Error Boundary Details");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("Component Stack:", errorInfo.componentStack);
    console.groupEnd();
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={this.resetError}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const isNetworkError = error.message.includes('fetch') || 
                         error.message.includes('network') || 
                         error.message.includes('connection');
  
  const isChunkError = error.message.includes('chunk') || 
                       error.message.includes('loading CSS chunk') ||
                       error.message.includes('Loading chunk');

  const handleRefresh = () => {
    if (isChunkError) {
      // For chunk loading errors, do a hard refresh
      window.location.reload();
    } else {
      // For other errors, try soft reset first
      resetError();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-400" />
        </div>
        
        <h1 className="text-xl font-semibold text-white mb-2">
          {isNetworkError ? "Connection Error" : 
           isChunkError ? "Loading Error" : 
           "Something Went Wrong"}
        </h1>
        
        <p className="text-white/80 mb-6 text-sm">
          {isNetworkError 
            ? "Unable to connect to the server. Please check your internet connection."
            : isChunkError 
            ? "There was a problem loading the application. This usually happens after an update."
            : "An unexpected error occurred. We're sorry for the inconvenience."}
        </p>

        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-black/20 rounded text-left text-xs text-white/70 font-mono">
            <div className="font-semibold mb-1">Error Details:</div>
            <div className="break-all">{error.message}</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRefresh}
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4" />
            {isChunkError ? "Refresh Page" : "Try Again"}
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <p className="text-white/60 text-xs mt-4">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

// Hook for using error boundary in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error("Error captured by useErrorHandler:", error);
    
    // Don't throw pagination or network errors to error boundary
    // These should be handled in the UI instead
    const isPaginationError = error.message.includes('400') || 
                              error.message.includes('cursor') ||
                              error.message.includes('Failed to fetch messages');
    
    const isNetworkError = error.message.includes('fetch') || 
                          error.message.includes('network') || 
                          error.message.includes('connection');
    
    // Only trigger error boundary for serious errors, not API/network issues
    if (!isPaginationError && !isNetworkError) {
      setError(error);
    }
    
    // For pagination/network errors, just log them but don't trigger error boundary
  }, []);

  // Re-throw error in render phase to trigger error boundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

export default ErrorBoundary; 