import { useCallback, useEffect, useState } from "react";

export function readLocalStorage(key, fallbackValue) {
  if (typeof window === "undefined") return fallbackValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}"`, error);
    return fallbackValue;
  }
}

export function writeLocalStorage(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}"`, error);
  }
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() =>
    readLocalStorage(key, initialValue),
  );

  useEffect(() => {
    writeLocalStorage(key, storedValue);
  }, [key, storedValue]);

  const setValue = useCallback((value) => {
    setStoredValue((currentValue) =>
      typeof value === "function" ? value(currentValue) : value,
    );
  }, []);

  return [storedValue, setValue];
}
