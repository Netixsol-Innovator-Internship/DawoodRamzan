import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3010/api", // backend root URL
  withCredentials: true, // if using cookies/sessions
});

export default api;
