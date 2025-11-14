// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // <-- backend port
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // ensure header format matches authMiddleware expectation "Bearer <token>"
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
