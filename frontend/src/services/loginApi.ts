import axios from 'axios';

// Set the base URL for the API
const API_URL = process.env.REACT_APP_BACKEND_APP_API_URL;
const api = axios.create({
  baseURL: `${API_URL}/auth`, // Adjust this URL based on your backend's address
});

export const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/login', { username, password }, { withCredentials: true });

      return response.data;
    } catch (error) {
      console.error('Failed to log in', error);
      throw error;
    }
};