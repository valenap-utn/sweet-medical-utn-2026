"use client";

import {useEffect, useRef, useState} from "react";
import {FaChevronDown, FaUserCircle} from "react-icons/fa";
import Link from "next/link";
import ConfirmLogoutModal from "../common/ConfirmLogout";

export default function UserMenu({username, onLogout}) {
    const [open, setOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <>
            <div ref={ref} style={{position: "relative"}}>
                <button onClick={() => setOpen(!open)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 14px",
                            borderRadius: 999,
                            border: "1px solid var(--line)",
                            background: "#fff",
                            cursor: "pointer",
                            color: "var(--p)",
                            fontWeight: 700,
                            fontFamily: "inherit"
                        }}
                >
                    <FaUserCircle size={18}/>
                    <span>{username}</span>
                    <FaChevronDown size={12}
                                   style={{
                                       transform: open ? "rotate(180deg)" : "",
                                       transition: ".2s",
                                   }}
                    />
                </button>

                {open && (
                    <div style={{
                        position: "absolute",
                        right: 0,
                        top: "115%",
                        width: 220,
                        background: "#fff",
                        borderRadius: 14,
                        border: "1px solid var(--outline-v)",
                        boxShadow: "0 12px 30px rgba(0,0,0,.1)",
                        overflow: "hidden",
                        zIndex: 999,
                    }}>
                        <Link
                            href="/perfil"
                            onClick={() => setOpen(false)}
                            style={{
                                width: "100%",
                                padding: 14,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                color: "var(--on-surf)",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            {/*<FaUserCircle/>*/}
                            Mi perfil
                        </Link>

                        <button
                            onClick={() => {
                                setOpen(false);
                                setConfirmLogout(true);
                            }}
                            style={{
                                width: "100%",
                                padding: 14,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                border: 0,
                                borderTop: "1px solid var(--outline-v)",
                                background: "white",
                                color: "var(--on-surf)",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            {/*<FaSignOutAlt/>*/}
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>

            <ConfirmLogoutModal
                open={confirmLogout}
                onCancel={() => setConfirmLogout(false)}
                onConfirm={() => {
                    setConfirmLogout(false);
                    onLogout();
                }}
            />

        </>
    );
}