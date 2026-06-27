import API_URL from "./api";

export const loginRequest = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Email o contraseña incorrectos");
  }

  return await response.json();
};

export const registerRequest = async (nombre, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, email, password }),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el usuario");
  }

  return await response.json();
};

