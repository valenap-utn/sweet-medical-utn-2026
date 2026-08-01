"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerNoLeidas, marcarComoLeida as marcarComoLeidaApi } from "@/lib/notificacionesApi";

const NotificacionesContext = createContext(null);
const INTERVALO_POLLING = 30000; // 30s

export function NotificacionesProvider({ children }) {
    const { usuario } = useAuth();
    const [noLeidas, setNoLeidas] = useState([]);
    const intervalRef = useRef(null);

    const refrescar = useCallback(async () => {
        if (!usuario?.usuarioId) return;
        try {
            const data = await obtenerNoLeidas(usuario.usuarioId);
            setNoLeidas(data);
        } catch (error) {
            console.error("No se pudieron cargar las notificaciones", error);
        }
    }, [usuario?.usuarioId]);

    useEffect(() => {
        if (!usuario?.usuarioId) {
            setNoLeidas([]);
            return;
        }

        refrescar(); // carga inicial
        intervalRef.current = setInterval(refrescar, INTERVALO_POLLING);

        return () => clearInterval(intervalRef.current);
    }, [usuario?.usuarioId, refrescar]);

    const marcarLeida = useCallback(async (notificacionId) => {
        // actualización optimista: la sacamos de la lista ya
        setNoLeidas((prev) => prev.filter((n) => n._id !== notificacionId));
        try {
            await marcarComoLeidaApi(notificacionId, usuario.usuarioId);
        } catch (error) {
            console.error("No se pudo marcar como leída", error);
            refrescar(); // si falló, volvemos a sincronizar con el server
        }
    }, [usuario?.usuarioId, refrescar]);

    return (
        <NotificacionesContext.Provider value={{ noLeidas, refrescar, marcarLeida }}>
            {children}
        </NotificacionesContext.Provider>
    );
}

export function useNotificaciones() {
    const ctx = useContext(NotificacionesContext);
    if (!ctx) throw new Error("useNotificaciones debe usarse dentro de un NotificacionesProvider");
    return ctx;
}