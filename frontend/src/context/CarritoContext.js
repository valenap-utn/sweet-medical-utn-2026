"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

const CarritoContext = createContext(null);
const STORAGE_KEY = "sweet-medical-carrito";

export function CarritoProvider({children}) {
  const [items, setItems] = useState([]);
  const [carritoCargado, setCarritoCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);

      if (guardado) {
        const itemsGuardados = JSON.parse(guardado);

        if (Array.isArray(itemsGuardados)) {
          setItems(itemsGuardados);
        }
      }
    } catch (error) {
      console.error("No se pudo cargar el carrito desde localStorage", error);
    } finally {
      setCarritoCargado(true);
    }
  }, []);

  useEffect(() => {
    if (!carritoCargado) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("No se pudo guardar el carrito en localStorage", error);
    }
  }, [items, carritoCargado]);

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

  const vaciar = useCallback(() => {
    setItems([]);

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("No se pudo limpiar el carrito en localStorage", error);
    }
  }, []);

  const total = useMemo(
      () => items.reduce((acc, t) => acc + (t.costo ?? 0), 0),
      [items]
  );

  return (
      <CarritoContext.Provider
          value={{
            items,
            agregar,
            quitar,
            estaEnCarrito,
            vaciar,
            total,
          }}
      >
        {children}
      </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);

  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }

  return ctx;
}