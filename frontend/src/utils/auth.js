export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
};

const normalizeRole = (role) => {
  if (!role) return null;

  if (Array.isArray(role)) {
    const firstRole = role[0]?.authority || role[0];
    return normalizeRole(firstRole);
  }

  return role.toString().replace("ROLE_", "").toUpperCase();
};

export const getUserFromToken = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));

    const rawRole =
      decodedPayload.rol ||
      decodedPayload.role ||
      decodedPayload.authority ||
      decodedPayload.authorities;

    return {
      email: decodedPayload.sub,
      role: normalizeRole(rawRole),
      exp: decodedPayload.exp,
    };
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = () => {
  const user = getUserFromToken();

  if (!user || !user.exp) return false;

  const currentTime = Date.now() / 1000;

  return user.exp < currentTime;
};

export const isAuthenticated = () => {
  const token = getToken();

  if (!token) return false;

  if (isTokenExpired()) {
    logout();
    return false;
  }

  return true;
};

export const isAdmin = () => {
  const user = getUserFromToken();
  return user?.role === "ADMIN";
};

export const isUser = () => {
  const user = getUserFromToken();
  return user?.role === "USER";
};

export const hasRole = (roles = []) => {
  const user = getUserFromToken();

  if (!user?.role) return false;

  return roles.includes(user.role);
};

