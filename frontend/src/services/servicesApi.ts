import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_APP_API_URL;
const api = axios.create({
  baseURL: `${API_URL}/api`, // Adjust this URL based on your backend's address
});

///Function to get the service image url by service ID
export const getImageUrl = (id: number) => {
  return `${API_URL}/api/services/image/${id}`;
};
