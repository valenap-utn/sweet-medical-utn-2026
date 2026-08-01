"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { useNotificaciones } from "@/context/NotificacionesContext";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";

export default function CampanaNotificacion() {
    const { noLeidas, marcarLeida } = useNotificaciones();
    const { usuario } = useAuth();
    const router = useRouter();
    const [abierto, setAbierto] = useState(false);

    // Todavía no existe una página de detalle por turno ni un "mis turnos"
    // para el paciente, así que navegamos a la pantalla más cercana que
    // ya existe según el rol. Cuando exista esa página, cambiar por
    // algo como `/turnos/${n.turnoId}`.
    const handleClickNotificacion = (n) => {
        marcarLeida(n._id);
        setAbierto(false);
        if (usuario?.rol === RolUsuario.MEDICO) {
            router.push("/medico/agenda");
        } else {
            router.push("/turnos");
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setAbierto((v) => !v)}
                aria-label="Notificaciones"
                style={{
                    position: "relative", background: "transparent", border: "none",
                    cursor: "pointer", padding: 8, color: "var(--p)", fontSize: 18,
                }}
            >
                <FaBell />
                {noLeidas.length > 0 && (
                    <span style={{
                        position: "absolute", top: 2, right: 2, width: 16, height: 16,
                        background: "var(--p)", color: "#fff", borderRadius: "50%",
                        fontSize: 9, fontWeight: 700, display: "flex",
                        alignItems: "center", justifyContent: "center",
                    }}>
            {noLeidas.length > 9 ? "9+" : noLeidas.length}
          </span>
                )}
            </button>

            {abierto && (
                <div style={{
                    position: "absolute", right: 0, top: "100%", marginTop: 8,
                    width: 320, maxHeight: 400, overflowY: "auto",
                    background: "#fff", borderRadius: 12, border: "1px solid var(--outline-v)",
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 200,
                }}>
                    {noLeidas.length === 0 ? (
                        <p style={{ padding: 16, fontSize: 13, color: "var(--on-surf-v)" }}>
                            No tenés notificaciones nuevas.
                        </p>
                    ) : (
                        noLeidas.map((n) => (
                            <button
                                key={n._id}
                                onClick={() => handleClickNotificacion(n)}
                                style={{
                                    display: "block", width: "100%", textAlign: "left",
                                    padding: "12px 16px", fontSize: 13, background: "transparent",
                                    border: "none", borderBottom: "1px solid var(--outline-v)",
                                    cursor: "pointer", fontFamily: "inherit",
                                }}
                            >
                                {n.mensaje}
                                <br />
                                <span style={{ fontSize: 11, color: "var(--on-surf-v)" }}>
                  {new Date(n.fechaHoraCreacion).toLocaleString("es-AR")}
                </span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}