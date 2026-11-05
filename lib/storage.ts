"use client";

import { defaultProgress } from "@/lib/trainer";
import type { StoredProgress } from "@/lib/types";

const STORAGE_KEY = "tense-trainer-progress-v2";

export function readProgress() {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultProgress);
    const parsed = JSON.parse(raw) as StoredProgress;
    if (!parsed || parsed.version !== 2 || !parsed.tenseStats || !Array.isArray(parsed.recentSessions)) {
      return structuredClone(defaultProgress);
    }
    return {
      ...defaultProgress,
      ...parsed,
    };
  } catch {
    return structuredClone(defaultProgress);
  }
}

export function saveProgress(progress: StoredProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Practice still works when private browsing or a full quota disables storage.
  }
}
