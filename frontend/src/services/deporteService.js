import API_URL, { getAuthHeaders } from "./api";

export const getDeportes = async () => {
  const response = await fetch(`${API_URL}/deportes`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los deportes");
  }

  return await response.json();
};

export const createDeporte = async (deporte) => {
  const response = await fetch(`${API_URL}/deportes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(deporte),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el deporte");
  }

  return await response.json();
};

export const updateDeporte = async (id, deporte) => {
  const response = await fetch(`${API_URL}/deportes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(deporte),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el deporte");
  }

  return await response.json();
};

export const deleteDeporte = async (id) => {
  const response = await fetch(`${API_URL}/deportes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el deporte");
  }
};

