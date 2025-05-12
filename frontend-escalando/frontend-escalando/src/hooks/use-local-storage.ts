
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Obtener del almacenamiento local por clave
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, devolver initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Devolver una versión envuelta de la función useState's setter
  const setValue = (value: T) => {
    try {
      // Permitir que value sea una función para seguir el mismo patrón que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
      // Guardar en almacenamiento local
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
