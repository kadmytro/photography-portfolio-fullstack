import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_APP_API_URL;
const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");

      if (window.location.pathname === "/admin") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
