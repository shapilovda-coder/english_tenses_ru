import { tenseMap, tenses } from "@/content/tenses";
import { toBeWarmupQuestions } from "@/content/tobe-warmup";
import { comparisonPractice } from "@/content/practice";
import type {
  ExerciseQuestion,
  ExerciseTemplate,
  FillBlankTemplate,
  SessionResult,
  StoredProgress,
  TenseDefinition,
  TenseProgress,
  TrainerSelection,
} from "@/lib/types";

const MAX_SELECTED = 4;

export const defaultProgress: StoredProgress = {
  version: 2,
  theme: "light",
  totalQuestions: 0,
  totalCorrect: 0,
  streak: 0,
  lastPracticeDate: null,
  lastPracticedTenseIds: [],
  tenseStats: {},
  recentSessions: [],
};

export function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export function clampSelectedTenses(selectedTenseIds: string[]) {
  return [...new Set(selectedTenseIds)].filter((id) => tenseMap[id]).slice(0, MAX_SELECTED);
}

function templateToQuestion(tense: TenseDefinition, template: ExerciseTemplate, seed: number): ExerciseQuestion {
  return {
    id: `${tense.id}-${template.id}-${seed}`,
    tenseId: tense.id,
    tenseName: tense.nameRu,
    kind: template.kind,
    prompt: template.prompt,
    instruction: template.prompt,
    clue: template.clue,
    pattern: template.pattern,
    example: tense.examples[seed % tense.examples.length],
    choices:
      template.kind === "multiple_choice" || template.kind === "tense_choice"
        ? template.choices
        : undefined,
    words: template.kind === "word_order" ? shuffle(template.words) : undefined,
    source: template.kind === "transform" ? template.source : undefined,
    incorrect: template.kind === "error_correction" ? template.incorrect : undefined,
    answer: template.answer,
    acceptedAnswers:
      template.kind === "fill_blank"
        ? [template.answer, ...((template as FillBlankTemplate).acceptedAnswers ?? [])]
        : undefined,
  };
}

function getWeakPatterns(progress: StoredProgress, tenseIds: string[]) {
  return tenseIds
    .flatMap((tenseId) => {
      const mistakes = progress.tenseStats[tenseId]?.mistakes ?? {};
      return Object.entries(mistakes).map(([pattern, count]) => ({
        tenseId,
        pattern,
        count,
      }));
    })
    .sort((left, right) => right.count - left.count)
    .slice(0, 6);
}

export function buildQuestionSet(selection: TrainerSelection, progress: StoredProgress) {
  if (selection.mode === "tobe_warmup") return shuffle(toBeWarmupQuestions).slice(0, 12);

  const selected = clampSelectedTenses(selection.selectedTenseIds);
  const active = selected.length ? selected : ["present_simple", "past_simple"];
  const limit = selection.mode === "quick" ? 6 : selection.mode === "standard" ? 12 : selection.mode === "weak_spots" ? 8 : 10;
  const allQuestions = tenses.flatMap((tense) => tense.exerciseTemplates.map((template, index) => templateToQuestion(tense, template, index)));
  const topicPool = comparisonPractice[selection.practiceId ?? ""];
  let pool = topicPool ?? allQuestions.filter((q) => active.includes(q.tenseId));

  if (selection.mode === "weak_spots") {
    const weak = getWeakPatterns(progress, tenses.map((tense) => tense.id)).filter((item) => item.count > 0);
    const matches = [...allQuestions, ...Object.values(comparisonPractice).flat()].filter((q) =>
      weak.some((item) => item.tenseId === q.tenseId && item.pattern === q.pattern));
    if (matches.length) pool = matches;
    return shuffle(pool).slice(0, limit);
  }

  const warmup = selection.includeWarmup && !topicPool ? shuffle(toBeWarmupQuestions).slice(0, 2) : [];
  // Round-robin avoids dropping a selected tense from a short mixed session.
  const groups = active.map((id) => shuffle(pool.filter((q) => q.tenseId === id)));
  const chosen: ExerciseQuestion[] = [];
  while (chosen.length < limit - warmup.length && groups.some((group) => group.length)) {
    for (const group of groups) {
      const question = group.pop();
      if (question && chosen.length < limit - warmup.length) chosen.push(question);
    }
  }
  return [...warmup, ...shuffle(chosen)];
}

export function getAccuracy(correct: number, attempted: number) {
  if (attempted === 0) return 0;
  return Math.round((correct / attempted) * 100);
}

export function getTodayDateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function updateStreak(progress: StoredProgress) {
  const today = getTodayDateKey();
  const previous = progress.lastPracticeDate;

  if (!previous) {
    progress.streak = 1;
    progress.lastPracticeDate = today;
    return;
  }

  if (previous === today) {
    return;
  }

  const diff =
    (new Date(today).getTime() - new Date(previous).getTime()) / (1000 * 60 * 60 * 24);

  progress.streak = diff === 1 ? progress.streak + 1 : 1;
  progress.lastPracticeDate = today;
}

function ensureTenseProgress(progress: StoredProgress, tenseId: string): TenseProgress {
  if (!progress.tenseStats[tenseId]) {
    progress.tenseStats[tenseId] = {
      attempted: 0,
      correct: 0,
      mistakes: {},
    };
  }
  return progress.tenseStats[tenseId];
}

export interface CompletedAnswer {
  question: ExerciseQuestion;
  correct: boolean;
}

export function applySessionResult(
  progress: StoredProgress,
  selection: TrainerSelection,
  answers: CompletedAnswer[]
) {
  const next: StoredProgress = structuredClone(progress);
  updateStreak(next);

  let totalCorrectInSession = 0;
  const weakPatterns = new Set<string>();

  answers.forEach(({ question, correct }) => {
    const tenseProgress = ensureTenseProgress(next, question.tenseId);
    tenseProgress.attempted += 1;
    next.totalQuestions += 1;

    if (correct) {
      tenseProgress.correct += 1;
      next.totalCorrect += 1;
      totalCorrectInSession += 1;
      if (tenseProgress.mistakes[question.pattern]) {
        tenseProgress.mistakes[question.pattern] = Math.max(0, tenseProgress.mistakes[question.pattern] - 1);
      }
    } else {
      tenseProgress.mistakes[question.pattern] = (tenseProgress.mistakes[question.pattern] ?? 0) + 1;
      weakPatterns.add(question.pattern);
    }
  });

  const selectedTenseIds = [...new Set(answers.map(({question}) => question.tenseId))].filter((id) => id !== "tobe_warmup");
  next.lastPracticedTenseIds = selectedTenseIds;

  const attempted = answers.length;
  const session: SessionResult = {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    label:
      selection.mode === "quick"
        ? "Быстрая тренировка"
        : selection.mode === "standard"
          ? "Обычная тренировка"
          : selection.mode === "weak_spots"
            ? "Слабые места"
            : selection.mode === "tobe_warmup"
              ? "Разминка To be"
              : "Смешанная тренировка",
    selectedTenseIds,
    attempted,
    correct: totalCorrectInSession,
    accuracy: getAccuracy(totalCorrectInSession, attempted),
    weakPatterns: [...weakPatterns].slice(0, 4),
  };

  next.recentSessions = [session, ...next.recentSessions].slice(0, 8);
  return next;
}

export function getOverviewStats(progress: StoredProgress) {
  return tenses.map((tense) => {
    const stat = progress.tenseStats[tense.id];
    return {
      id: tense.id,
      nameRu: tense.nameRu,
      attempted: stat?.attempted ?? 0,
      accuracy: getAccuracy(stat?.correct ?? 0, stat?.attempted ?? 0),
      weakPattern:
        Object.entries(stat?.mistakes ?? {}).filter(([, count]) => count > 0).sort((left, right) => right[1] - left[1])[0]?.[0] ??
        null,
    };
  });
}

export function getRecommendedTenses(progress: StoredProgress) {
  const stats = getOverviewStats(progress)
    .filter((item) => item.attempted > 0)
    .sort((left, right) => left.accuracy - right.accuracy);

  if (stats.length === 0) {
    return ["present_simple", "present_continuous", "past_simple"];
  }

  return stats.slice(0, 3).map((item) => item.id);
}
