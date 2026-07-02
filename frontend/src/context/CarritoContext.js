"use client";
import { createContext, useCallback, useContext, useState } from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  const agregar = useCallback((turno) => {
    setItems((prev) =>
      prev.find((t) => t._id === turno._id) ? prev : [...prev, turno]
    );
  }, []);

  const quitar = useCallback((turnoId) => {
    setItems((prev) => prev.filter((t) => t._id !== turnoId));
  }, []);

  const estaEnCarrito = useCallback(
    (turnoId) => items.some((t) => t._id === turnoId),
    [items]
  );

  const vaciar = useCallback(() => setItems([]), []);

  const total = items.reduce((acc, t) => acc + (t.costo ?? 0), 0);

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, estaEnCarrito, vaciar, total }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
