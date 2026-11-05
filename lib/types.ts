export type TimePeriod = "present" | "past" | "future";
export type TenseFamily =
  | "simple"
  | "continuous"
  | "perfect"
  | "perfect_continuous";

export type ExerciseKind =
  | "multiple_choice"
  | "word_order"
  | "fill_blank"
  | "tense_choice"
  | "error_correction"
  | "transform";

export type TransformTarget = "question" | "negative" | "affirmative";

export interface TenseExample {
  en: string;
  ru: string;
}

export interface TenseFormulas {
  affirmative: string;
  negative: string;
  question: string;
}

interface BaseTemplate {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  clue: string;
  pattern: string;
}

export interface MultipleChoiceTemplate extends BaseTemplate {
  kind: "multiple_choice";
  choices: string[];
  answer: string;
}

export interface WordOrderTemplate extends BaseTemplate {
  kind: "word_order";
  words: string[];
  answer: string;
}

export interface FillBlankTemplate extends BaseTemplate {
  kind: "fill_blank";
  answer: string;
  acceptedAnswers?: string[];
}

export interface TenseChoiceTemplate extends BaseTemplate {
  kind: "tense_choice";
  choices: string[];
  answer: string;
}

export interface ErrorCorrectionTemplate extends BaseTemplate {
  kind: "error_correction";
  incorrect: string;
  answer: string;
}

export interface TransformTemplate extends BaseTemplate {
  kind: "transform";
  source: string;
  answer: string;
  target: TransformTarget;
}

export type ExerciseTemplate =
  | MultipleChoiceTemplate
  | WordOrderTemplate
  | FillBlankTemplate
  | TenseChoiceTemplate
  | ErrorCorrectionTemplate
  | TransformTemplate;

export interface TenseDefinition {
  id: string;
  nameRu: string;
  nameEn: string;
  period: TimePeriod;
  family: TenseFamily;
  shortRule: string;
  usage: string[];
  formulas: TenseFormulas;
  signalWords: string[];
  examples: TenseExample[];
  commonMistakes: string[];
  exerciseTemplates: ExerciseTemplate[];
}

export interface ExerciseQuestion {
  id: string;
  tenseId: string;
  tenseName: string;
  kind: ExerciseKind;
  prompt: string;
  clue: string;
  pattern: string;
  example: TenseExample;
  words?: string[];
  choices?: string[];
  source?: string;
  incorrect?: string;
  answer: string;
  acceptedAnswers?: string[];
  instruction?: string;
}

export interface SessionResult {
  id: string;
  date: string;
  label: string;
  selectedTenseIds: string[];
  attempted: number;
  correct: number;
  accuracy: number;
  weakPatterns: string[];
}

export interface TenseProgress {
  attempted: number;
  correct: number;
  mistakes: Record<string, number>;
}

export interface StoredProgress {
  version: number;
  theme: "light" | "dark";
  totalQuestions: number;
  totalCorrect: number;
  streak: number;
  lastPracticeDate: string | null;
  lastPracticedTenseIds: string[];
  tenseStats: Record<string, TenseProgress>;
  recentSessions: SessionResult[];
}

export interface TrainerSelection {
  selectedTenseIds: string[];
  mode: "quick" | "standard" | "mixed" | "weak_spots" | "tobe_warmup";
  includeWarmup: boolean;
  practiceId?: string;
}
