import type { ExerciseQuestion } from "@/lib/types";

export function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/[’‘]/g, "'")
    .replace(/\bwon'?t\b/g, "will not")
    .replace(/\b(is|are|was|were|do|does|did|has|have|had)n'?t\b/g, "$1 not")
    .replace(/\bi'm\b/g, "i am")
    .replace(/\b(you|we|they)'re\b/g, "$1 are")
    .replace(/\b(i|you|we|they)'ve\b/g, "$1 have")
    .replace(/\b(i|you|he|she|it|we|they)'ll\b/g, "$1 will")
    .replace(/[.?!,;:]/g, "").replace(/\s+/g, " ").trim();
}

export function isCorrectAnswer(question: ExerciseQuestion, value: string) {
  return [question.answer, ...(question.acceptedAnswers ?? [])]
    .some((answer) => normalizeAnswer(answer) === normalizeAnswer(value));
}
