import { appConfig } from '../config/env';

interface ErrorPayload {
  message: string;
  stack?: string;
  source: 'window' | 'unhandledrejection' | 'react';
  url: string;
  timestamp: string;
}

const reportError = (error: unknown, source: ErrorPayload['source']) => {
  const normalized = error instanceof Error ? error : new Error(String(error));
  const payload: ErrorPayload = {
    message: normalized.message,
    stack: normalized.stack,
    source,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  console.error(`[${source}]`, normalized);

  if (appConfig.errorReportingUrl) {
    void fetch(appConfig.errorReportingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Monitoring must never interrupt the user experience.
    });
  }
};

export const initializeErrorMonitoring = () => {
  const handleError = (event: ErrorEvent) => reportError(event.error || event.message, 'window');
  const handleRejection = (event: PromiseRejectionEvent) => reportError(event.reason, 'unhandledrejection');

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
};

export const reportReactError = (error: Error) => reportError(error, 'react');
