import axios from 'axios';

export const fetchCSRFToken = async (): Promise<string> => {
  try {
    const response = await axios.get('/api/csrf/get_token', { withCredentials: true });
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
};
