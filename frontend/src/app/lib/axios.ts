import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
   console.log("Environment variable NEST_URL is not set.");
}
console.log("Backend URL:", backendUrl);
const api = axios.create({
   baseURL: backendUrl,
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
});

export default api;
