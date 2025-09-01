/* eslint-disable @typescript-eslint/no-explicit-any */
const isDevelopment = import.meta.env.NODE_ENV === 'development';
const isProduction = import.meta.env.NODE_ENV === 'production';

const logger = {
  info: (message: any) => {
    if (isDevelopment) console.info(message);
  },
  warn: (message: any) => {
    if (isDevelopment || isProduction) console.warn(message);
  },
  error: (message: any, error?: any, fileName?: string) => {
    if (isDevelopment || isProduction) {
      const errorMessage = error instanceof Error ? error.stack : message;
      const logMessage = `[${fileName || 'Unknown file'}] Error: ${errorMessage}`;
      console.error(logMessage);
    }
  },
};

export default logger;
