// Use localStorage to persist the token between page refreshes
const TOKEN_KEY = 'auth_token';

export const setToken = (newToken: string) => {
  console.log('Setting token:', newToken ? 'Token exists (not showing for security)' : 'No token');

  try {
    // Store token in localStorage for persistence
    localStorage.setItem(TOKEN_KEY, newToken);
    console.log('Token stored in localStorage');
  } catch (error) {
    console.error('Failed to store token in localStorage:', error);
  }
};

export const getToken = (): string | null => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Getting token from localStorage:', token ? 'Token exists' : 'No token');
    return token;
  } catch (error) {
    console.error('Failed to get token from localStorage:', error);
    return null;
  }
};
