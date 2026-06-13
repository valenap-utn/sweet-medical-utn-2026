import axios from "axios";

// URL base del backend. Se puede sobreescribir con NEXT_PUBLIC_API_URL en .env.local
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // necesario: el backend setea cookies httpOnly (accessToken/refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de respuesta: si el accessToken expiró (401), intentamos refrescarlo
// una sola vez y reintentamos la request original.
let isRefreshing = false;
let pendingQueue = [];

function resolvePending(error) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || config._retry || config.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(() => api(config));
    }

    config._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      resolvePending(null);
      return api(config);
    } catch (refreshError) {
      resolvePending(refreshError);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Extrae un mensaje de error legible desde una respuesta de Axios,
 * compatible con el formato de errores del backend de Sweet Medical.
 */
export function getApiErrorMessage(error, fallback = "Ocurrió un error inesperado. Probá nuevamente.") {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.";
    }
    const data = error.response.data;
    return (
      data?.mensaje ||
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errores) ? data.errores.join(" ") : null) ||
      fallback
    );
  }
  return fallback;
}
