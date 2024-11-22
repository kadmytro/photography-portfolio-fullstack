import axios from "axios";

// Set the base URL for the API
const API_URL = process.env.REACT_APP_BACKEND_APP_API_URL;
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Function to get all photos
export const getPhotos = async () => {
  try {
    const response = await api.get("/photos");
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching photos", error);
    }
    return [];
  }
};

// Function to get recent photos
export const getRecentPhotos = async () => {
  try {
    const response = await api.get("/photos/recent");
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching recent photos", error);
    }
    return [];
  }
};

//Function to get the photo url by ID
export const getPhotoUrl = (id: number) => {
  const width = window.innerWidth;
  if (width > 1000) {
    return `${API_URL}/api/photos/${id}`;
  } else {
    return `${API_URL}/api/photos/${id}/mobile`;
  }
};

// Function to get photos by category ID
export const getPhotosByCategoryId = async (categoryId: number) => {
  try {
    const response = await api.get(`/photos/byCategory/${categoryId}`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Error fetching recent photos with the categoryId: ${categoryId}`,
        error
      );
    }
    return [];
  }
};

export const getPhotoCategoriesToDisplay = async () => {
  try {
    const response = await api.get(`/categories/categoriesToDisplay`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching photo categories", error);
      return [];
    }
  }
};

// Function to get a photo by ID
export const getPhotoById = async (id: number) => {
  try {
    const response = await api.get(`/photos/${id}`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error fetching photo with ID ${id}`, error);
      throw error;
    }
  }
};

// Function to get photos by date
export const getPhotosByDate = async (date: string) => {
  try {
    const response = await api.get(`/photos/date/${date}`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error fetching photos for date ${date}`, error);
    }
    return [];
  }
};
