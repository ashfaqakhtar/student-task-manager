import { useEffect, useRef, useState } from "react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

export function useTimer(onWorkSessionComplete) {
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        if (mode === "work" && startedAtRef.current) {
          onWorkSessionComplete?.(startedAtRef.current, new Date().toISOString());
        }

        const nextMode = mode === "work" ? "break" : "work";
        setMode(nextMode);
        startedAtRef.current = nextMode === "work" ? new Date().toISOString() : null;
        return nextMode === "work" ? WORK_SECONDS : BREAK_SECONDS;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, mode, onWorkSessionComplete]);

  const start = () => {
    if (!startedAtRef.current && mode === "work") {
      startedAtRef.current = new Date().toISOString();
    }
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(WORK_SECONDS);
    startedAtRef.current = null;
  };

  return {
    mode,
    secondsLeft,
    isRunning,
    totalSeconds: mode === "work" ? WORK_SECONDS : BREAK_SECONDS,
    start,
    pause,
    reset,
  };
}
