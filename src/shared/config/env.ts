/**
 * Environment configuration
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'NextJS Website',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
