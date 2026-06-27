import API_URL, { getAuthHeaders } from "./api";

export const crearReserva = async (reserva) => {
  const response = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(reserva),
  });

  if (!response.ok) {
    const mensaje = await response.text();
    throw new Error(mensaje || "No se pudo crear la reserva");
  }

  return await response.json();
};

export const getMisReservas = async () => {
  const response = await fetch(`${API_URL}/reservas/mis-reservas`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar tus reservas");
  }

  return await response.json();
};

export const getReservas = async () => {
  const response = await fetch(`${API_URL}/reservas`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las reservas");
  }

  return await response.json();
};

export const cancelarReserva = async (id) => {
  const response = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || `No se pudo cancelar la reserva. Status: ${response.status}`
    );
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};
export const getHorariosOcupados = async (canchaId, fecha) => {
  const response = await fetch(
    `${API_URL}/reservas/ocupadas?canchaId=${canchaId}&fecha=${fecha}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los horarios ocupados");
  }

  return await response.json();
};
export const confirmarReserva = async (id) => {
  const response = await fetch(`${API_URL}/reservas/${id}/confirmar`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || `No se pudo confirmar la reserva. Status: ${response.status}`
    );
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

export const finalizarReserva = async (id) => {
  const response = await fetch(`${API_URL}/reservas/${id}/finalizar`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || `No se pudo finalizar la reserva. Status: ${response.status}`
    );
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

