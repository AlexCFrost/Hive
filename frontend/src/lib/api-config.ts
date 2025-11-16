/**
 * API configuration utilities
 * Updated for Vercel deployment
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Builds a complete API endpoint URL
 * @param path - The API endpoint path (should start with /)
 * @returns The complete API URL
 */
export const apiEndpoint = (path: string): string => {
  return `${API_URL}${path}`;
};

export const getSocketUrl = (): string => {
  return API_URL;
};