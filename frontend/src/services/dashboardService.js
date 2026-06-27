import API_URL, { getAuthHeaders } from "./api";

export const getDashboardAdmin = async () => {
  const endpoints = [
    `${API_URL}/dashboard`,
    `${API_URL}/dashboard/resumen`,
    `${API_URL}/dashboard/admin`,
  ];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      return await response.json();
    }
  }

  throw new Error("No se pudo cargar el resumen del dashboard");
};

