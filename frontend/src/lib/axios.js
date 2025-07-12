import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
  timeout: 60000, // 1 minute default timeout (reduced from 15 minutes)
  maxContentLength: 50 * 1024 * 1024, // 50MB max content length (reduced from 100MB)
  maxBodyLength: 50 * 1024 * 1024, // 50MB max body length (reduced from 100MB)
});
