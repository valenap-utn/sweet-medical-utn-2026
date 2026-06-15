"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMe, login as loginRequest, logout as logoutRequest } from "@/lib/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Carga el usuario al iniciar la app vía GET /auth/me
  // req.user (JWT payload) tiene: { usuarioId, pacienteId, medicoId }
  // NO tiene nombreUsuario — lo guardamos por separado en state
  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const data = await getMe();
        if (activo) setUsuario(data);
      } catch {
        if (activo) setUsuario(null);
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  const login = useCallback(async (credenciales) => {
    const data = await loginRequest(credenciales);
    // El backend devuelve: { mensaje, usuario: { usuarioId, pacienteId, medicoId } }
    // Enriquecemos el objeto con el nombreUsuario que mandamos nosotros
    // porque el JWT payload no lo incluye
    const usuarioConNombre = {
      ...data.usuario,
      nombreUsuario: credenciales.nombreUsuario,
    };
    setUsuario(usuarioConNombre);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUsuario(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}
