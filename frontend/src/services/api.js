const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export default API_URL;



