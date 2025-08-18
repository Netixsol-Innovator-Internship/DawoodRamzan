import axios from "axios";

const api = axios.create({
  baseURL: "https://dawood-week3-day2-backend.vercel.app/api", // backend root URL
  withCredentials: true, // if using cookies/sessions
});

export default api;
