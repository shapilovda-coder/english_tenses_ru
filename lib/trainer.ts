import { tenseMap, tenses } from "@/content/tenses";
import { toBeWarmupQuestions } from "@/content/tobe-warmup";
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
  return selectedTenseIds.slice(0, MAX_SELECTED);
}

function templateToQuestion(tense: TenseDefinition, template: ExerciseTemplate, seed: number): ExerciseQuestion {
  return {
    id: `${tense.id}-${template.id}-${seed}`,
    tenseId: tense.id,
    tenseName: tense.nameRu,
    kind: template.kind,
    prompt:
      template.kind === "error_correction"
        ? template.incorrect
        : template.kind === "transform"
          ? template.source
          : template.prompt,
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

function selectTemplates(tense: TenseDefinition, count: number) {
  const pool = shuffle(tense.exerciseTemplates);
  const questions: ExerciseQuestion[] = [];
  for (let index = 0; index < count; index += 1) {
    const template = pool[index % pool.length];
    questions.push(templateToQuestion(tense, template, index));
  }
  return questions;
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
  const selected = clampSelectedTenses(selection.selectedTenseIds);
  const activeTenses =
    selection.mode === "weak_spots"
      ? getWeakPatterns(progress, tenses.map((tense) => tense.id))
          .map((item) => item.tenseId)
          .filter((value, index, array) => array.indexOf(value) === index)
          .slice(0, MAX_SELECTED)
      : selected;

  const fallbackTenses = activeTenses.length > 0 ? activeTenses : ["present_simple", "past_simple"];
  const questionsPerTense =
    selection.mode === "quick" || selection.mode === "tobe_warmup"
      ? 2
      : selection.mode === "standard"
        ? 3
        : 2;

  const generated = fallbackTenses.flatMap((tenseId) =>
    selectTemplates(tenseMap[tenseId], questionsPerTense)
  );

  const withWarmup = selection.includeWarmup
    ? [...shuffle(toBeWarmupQuestions).slice(0, 2), ...generated]
    : generated;

  const limit =
    selection.mode === "quick"
      ? 6
      : selection.mode === "standard"
        ? 12
        : selection.mode === "weak_spots"
          ? 8
          : selection.mode === "tobe_warmup"
            ? 4
            : 10;

  return shuffle(withWarmup).slice(0, limit);
}

export function getAccuracy(correct: number, attempted: number) {
  if (attempted === 0) return 0;
  return Math.round((correct / attempted) * 100);
}

export function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
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
    if (question.tenseId === "tobe_warmup") {
      return;
    }

    const tenseProgress = ensureTenseProgress(next, question.tenseId);
    tenseProgress.attempted += 1;
    next.totalQuestions += 1;

    if (correct) {
      tenseProgress.correct += 1;
      next.totalCorrect += 1;
      totalCorrectInSession += 1;
    } else {
      tenseProgress.mistakes[question.pattern] = (tenseProgress.mistakes[question.pattern] ?? 0) + 1;
      weakPatterns.add(question.pattern);
    }
  });

  const selectedTenseIds = clampSelectedTenses(selection.selectedTenseIds);
  next.lastPracticedTenseIds = selectedTenseIds;

  const attempted = answers.filter((answer) => answer.question.tenseId !== "tobe_warmup").length;
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
        Object.entries(stat?.mistakes ?? {}).sort((left, right) => right[1] - left[1])[0]?.[0] ??
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
