import API_URL, { getAuthHeaders } from "./api";

export const getCanchas = async () => {
  const response = await fetch(`${API_URL}/canchas`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las canchas");
  }

  return await response.json();
};

export const createCancha = async (cancha) => {
  const response = await fetch(`${API_URL}/canchas`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(cancha),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear la cancha");
  }

  return await response.json();
};

export const updateCancha = async (id, cancha) => {
  const response = await fetch(`${API_URL}/canchas/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(cancha),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar la cancha");
  }

  return await response.json();
};

export const deleteCancha = async (id) => {
  const response = await fetch(`${API_URL}/canchas/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la cancha");
  }
};
export const getCanchasActivas = async () => {
  const response = await fetch(`${API_URL}/canchas`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las canchas");
  }

  const data = await response.json();

  return data.filter((cancha) => cancha.activa !== false);
};

