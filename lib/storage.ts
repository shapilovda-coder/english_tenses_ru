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
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      ...defaultProgress,
      ...parsed,
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: StoredProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
