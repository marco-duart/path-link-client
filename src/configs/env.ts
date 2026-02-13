export const env = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  API_TOKEN: import.meta.env.VITE_API_TOKEN || '',
  ENV: import.meta.env.MODE || 'development',
};
