import axios from "axios";

// El backend corre en el puerto 4000 por defecto (ver server.js del backend)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: refresca el accessToken automáticamente si expira (401)
let isRefreshing = false;
let pendingQueue = [];

function resolvePending(error) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (
      !response ||
      response.status !== 401 ||
      config._retry ||
      config.url?.includes("/auth/")
    ) {
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
 * Extrae un mensaje de error legible desde una respuesta de Axios.
 *
 * El errorHandler del backend responde con: { status, message, timestamp }
 * (ver backend/src/middlewares/errorHandler.js)
 */
export function getApiErrorMessage(
  error,
  fallback = "Ocurrió un error inesperado. Probá nuevamente."
) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No pudimos conectarnos con el servidor. Verificá tu conexión.";
    }
    const data = error.response.data;
    // El backend usa "message" (errorHandler) y a veces "mensaje" (respuestas manuales)
    return (
      data?.message ||
      data?.mensaje ||
      data?.error ||
      (Array.isArray(data?.errores) ? data.errores.join(" ") : null) ||
      fallback
    );
  }
  return fallback;
}
