import { api } from "./api";

export async function obtenerNoLeidas(usuarioId) {
    const { data } = await api.get(`/notificaciones/no-leidas/${usuarioId}`);
    return data.data; // el controller responde { data: [...] }
}

export async function obtenerLeidas(usuarioId) {
    const { data } = await api.get(`/notificaciones/leidas/${usuarioId}`);
    return data.data;
}

export async function marcarComoLeida(notificacionId, usuarioId) {
    const { data } = await api.patch(`/notificaciones/${notificacionId}/leer`, {
        usuarioId,
    });
    return data.data;
}