export const METRIKA_ID = 114096471;
export const CONSENT_KEY = "tense-trainer-analytics-consent";

export type MetrikaFunction = ((id: number, method: string, ...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

declare global {
  interface Window {
    ym?: MetrikaFunction;
  }
}

export function track(event: string, parameters: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || window.location.hostname !== "xn--80aaebgia2ajkigjfdvu4a.xn--p1ai") return;
  try {
    if (window.localStorage.getItem(CONSENT_KEY) === "granted") window.ym?.(METRIKA_ID, "reachGoal", event, parameters);
  } catch {
    // Analytics is optional; storage restrictions must not interrupt practice.
  }
}
