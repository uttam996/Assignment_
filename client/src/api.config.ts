import axios from "axios";


export const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    // Get the token from Redux store
    // Access the Redux store
    const token = localStorage.getItem("token");

    console.log("Token:", token);
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle error
    return Promise.reject(error);
  }
);
