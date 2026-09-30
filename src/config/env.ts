const errorReportingUrl = import.meta.env.VITE_ERROR_REPORTING_URL?.trim();

export const appConfig = {
  appUrl: import.meta.env.VITE_APP_URL?.trim() || window.location.origin,
  errorReportingUrl: errorReportingUrl || null,
} as const;
