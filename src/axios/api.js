// api.js
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000", // Replace with your API base URL
  baseURL: "https://weby-appy-referral-backend.onrender.com", // Replace with your API base URL
});

export default api;
