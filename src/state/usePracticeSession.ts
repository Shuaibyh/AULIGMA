import { useState, type SetStateAction } from "react";
type PracticeSession = { answers: Record<number, number>; checked: number[] };
const empty: PracticeSession = { answers: {}, checked: [] };
const memory = new Map<string, PracticeSession>();
const sessionKey = (activity: string) => `auligma-practica-v11-${activity}`;
export function readPracticeSession(
  activity: string,
  count: number,
): PracticeSession {
  const key = sessionKey(activity);
  try {
    const parsed =
      JSON.parse(sessionStorage.getItem(key) || "null") || memory.get(key);
    if (
      !parsed ||
      !parsed.answers ||
      typeof parsed.answers !== "object" ||
      !Array.isArray(parsed.checked)
    )
      return empty;
    const answers: Record<number, number> = {};
    for (const [i, v] of Object.entries(parsed.answers))
      if (
        Number.isInteger(+i) &&
        +i >= 0 &&
        +i < count &&
        typeof v === "number" &&
        Number.isInteger(v) &&
        v >= 0 &&
        v < 4
      )
        answers[+i] = v;
    return {
      answers,
      checked: [
        ...new Set<number>(
          parsed.checked.filter(
            (i: unknown) =>
              typeof i === "number" &&
              Number.isInteger(i) &&
              answers[i] !== undefined,
          ),
        ),
      ],
    };
  } catch {
    return memory.get(key) || empty;
  }
}
// Solo respuestas sintéticas, con respaldo en memoria si el navegador bloquea el almacenamiento.
export function usePracticeSession(activity: string, count: number) {
  const [storageError, setStorageError] = useState(false);
  const [session, updateSession] = useState<PracticeSession>(() =>
    readPracticeSession(activity, count),
  );
  function setSession(action: SetStateAction<PracticeSession>) {
    const next = typeof action === "function" ? action(session) : action;
    updateSession(next);
    memory.set(sessionKey(activity), next);
    try {
      sessionStorage.setItem(sessionKey(activity), JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  return { session, setSession, storageError };
}
