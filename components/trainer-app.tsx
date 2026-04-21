"use client";

import { startTransition, useEffect, useMemo, useState, useDeferredValue } from "react";

import { tenseFamilies, tenseMap, tensePeriods, tenses } from "@/content/tenses";
import { applySessionResult, buildQuestionSet, defaultProgress, getOverviewStats, getRecommendedTenses, getAccuracy, shuffle } from "@/lib/trainer";
import { readProgress, saveProgress } from "@/lib/storage";
import type { ExerciseQuestion, StoredProgress, TrainerSelection, TimePeriod, TenseFamily } from "@/lib/types";

import styles from "./trainer-app.module.css";

type AnswerState = {
  questionId: string;
  value: string;
  correct: boolean;
};

const modeOptions: Array<{
  id: TrainerSelection["mode"];
  label: string;
  description: string;
}> = [
  { id: "quick", label: "Быстрый старт", description: "5–7 вопросов, чтобы быстро проверить себя." },
  { id: "standard", label: "Обычная тренировка", description: "12 вопросов, чтобы пройти тему глубже." },
  { id: "mixed", label: "Смешанная тренировка", description: "Несколько времен в одной сессии." },
  { id: "weak_spots", label: "Слабые места", description: "Повтор самых частых ошибок." },
  { id: "tobe_warmup", label: "Разминка To be", description: "Короткий блок перед основной практикой." },
];

const auxiliaryChoices = [
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[.?!,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function answerToLabel(question: ExerciseQuestion) {
  switch (question.kind) {
    case "multiple_choice":
      return "Выбери правильный вариант";
    case "word_order":
      return "Собери предложение";
    case "fill_blank":
      return "Вставь пропуск";
    case "tense_choice":
      return "Выбери правильное время";
    case "error_correction":
      return "Исправь ошибку";
    case "transform":
      return "Преобразуй предложение";
    default:
      return "Ответь на вопрос";
  }
}

function getCorrectness(question: ExerciseQuestion, value: string) {
  const normalizedValue = normalize(value);
  if (question.acceptedAnswers && question.acceptedAnswers.length > 0) {
    return question.acceptedAnswers.some((answer) => normalize(answer) === normalizedValue);
  }
  return normalize(question.answer) === normalizedValue;
}

function uniqueChoices(items: string[]) {
  return items.filter((item, index, array) => item && array.indexOf(item) === index);
}

function getFormExample(
  examples: { en: string; ru: string }[],
  type: "affirmative" | "negative" | "question"
) {
  const indexMap = {
    affirmative: 0,
    negative: 1,
    question: 2,
  } as const;

  return examples[indexMap[type]] ?? examples[0];
}

function buildSelectableChoices(question: ExerciseQuestion) {
  if (question.choices && question.choices.length > 0) {
    return question.choices;
  }

  if (question.kind === "fill_blank") {
    const exact = question.acceptedAnswers?.[0] ?? question.answer;
    const distractors = auxiliaryChoices
      .filter((choice) => normalize(choice) !== normalize(exact))
      .slice(0, 3);
    return shuffle(uniqueChoices([exact, ...distractors])).slice(0, 4);
  }

  if (question.kind === "error_correction") {
    const incorrect = question.incorrect ?? question.prompt;
    const softVariant = question.answer.replace(/\bnot\b/, "").replace(/\s+/g, " ").trim();
    return shuffle(uniqueChoices([question.answer, incorrect, softVariant])).slice(0, 3);
  }

  if (question.kind === "transform") {
    const source = question.source ?? question.prompt;
    const inverted =
      source.endsWith("?") ? source.replace(/\?$/, ".") : `${source}?`;
    return shuffle(uniqueChoices([question.answer, source, inverted])).slice(0, 3);
  }

  return undefined;
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.statPill}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: StoredProgress["theme"];
  onToggle: () => void;
}) {
  return (
    <button className={`${styles.iconButton} ${styles.themeButton}`} onClick={onToggle} type="button">
      {theme === "dark" ? "☀️ Свет" : "🌙 Тема"}
    </button>
  );
}

export function TrainerApp() {
  const [progress, setProgress] = useState<StoredProgress>(() => readProgress());
  const [selection, setSelection] = useState<TrainerSelection>({
    selectedTenseIds: ["present_simple", "past_simple"],
    mode: "quick",
    includeWarmup: true,
  });
  const [familyFilter, setFamilyFilter] = useState<"all" | TenseFamily>("all");
  const [periodFilter, setPeriodFilter] = useState<"all" | TimePeriod>("all");
  const [activeQuestions, setActiveQuestions] = useState<ExerciseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [wordBank, setWordBank] = useState<Record<string, string[]>>({});
  const [sessionFinished, setSessionFinished] = useState(false);

  const deferredFamilyFilter = useDeferredValue(familyFilter);
  const deferredPeriodFilter = useDeferredValue(periodFilter);

  useEffect(() => {
    saveProgress(progress);
    document.documentElement.dataset.theme = progress.theme;
  }, [progress]);

  const filteredTenses = useMemo(() => {
    return tenses.filter((tense) => {
      const familyMatches = deferredFamilyFilter === "all" || tense.family === deferredFamilyFilter;
      const periodMatches = deferredPeriodFilter === "all" || tense.period === deferredPeriodFilter;
      return familyMatches && periodMatches;
    });
  }, [deferredFamilyFilter, deferredPeriodFilter]);

  const overviewStats = useMemo(() => getOverviewStats(progress), [progress]);
  const recommended = useMemo(() => getRecommendedTenses(progress), [progress]);
  const currentQuestion = activeQuestions[currentIndex] ?? null;
  const currentQuestionOptions = useMemo(
    () => (currentQuestion ? buildSelectableChoices(currentQuestion) : undefined),
    [currentQuestion]
  );
  const selectedStats = useMemo(() => {
    return selection.selectedTenseIds.map((id) => tenseMap[id]).filter(Boolean);
  }, [selection.selectedTenseIds]);

  const sessionSummary = useMemo(() => {
    const completedAnswers = Object.values(answers);
    const attempted = completedAnswers.length;
    const correct = completedAnswers.filter((item) => item.correct).length;
    return {
      attempted,
      correct,
      accuracy: getAccuracy(correct, attempted),
    };
  }, [answers]);

  function updateTheme() {
    setProgress((previous) => ({
      ...previous,
      theme: previous.theme === "dark" ? "light" : "dark",
    }));
  }

  function toggleTense(tenseId: string) {
    startTransition(() => {
      setSelection((previous) => {
        const exists = previous.selectedTenseIds.includes(tenseId);
        if (exists) {
          return {
            ...previous,
            selectedTenseIds: previous.selectedTenseIds.filter((value) => value !== tenseId),
          };
        }

        if (previous.selectedTenseIds.length >= 4) {
          return previous;
        }

        return {
          ...previous,
          selectedTenseIds: [...previous.selectedTenseIds, tenseId],
        };
      });
    });
  }

  function startSession(mode: TrainerSelection["mode"]) {
    const baseSelection: TrainerSelection = {
      ...selection,
      mode,
      selectedTenseIds:
        mode === "weak_spots"
          ? recommended
          : selection.selectedTenseIds.length > 0
            ? selection.selectedTenseIds
            : ["present_simple", "past_simple"],
      includeWarmup: mode !== "tobe_warmup" && selection.includeWarmup,
    };

    const nextQuestions = buildQuestionSet(baseSelection, progress);
    setSelection(baseSelection);
    setActiveQuestions(nextQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setWordBank(
      Object.fromEntries(
        nextQuestions
          .filter((question) => question.kind === "word_order" && question.words)
          .map((question) => [question.id, shuffle(question.words ?? [])])
      )
    );
    setSessionFinished(false);
  }

  function saveSessionAndFinish() {
    const completed = activeQuestions
      .filter((question) => answers[question.id])
      .map((question) => ({
        question,
        correct: answers[question.id].correct,
      }));

    const nextProgress = applySessionResult(progress, selection, completed);
    setProgress(nextProgress);
    setSessionFinished(true);
  }

  function commitAnswer(value: string) {
    if (!currentQuestion) return;

    const correct = getCorrectness(currentQuestion, value);
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        value,
        correct,
      },
    }));
  }

  function nextQuestion() {
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    if (currentIndex === activeQuestions.length - 1) {
      saveSessionAndFinish();
      return;
    }
    setCurrentIndex((previous) => previous + 1);
  }

  function resetSelectionToRecommended() {
    setSelection((previous) => ({
      ...previous,
      selectedTenseIds: recommended,
    }));
  }

  function moveWord(questionId: string, word: string) {
    setWordBank((previous) => {
      const current = previous[questionId] ?? [];
      const index = current.findIndex((item) => item === word);
      if (index === -1) return previous;
      const next = [...current];
      next.splice(index, 1);
      return { ...previous, [questionId]: next };
    });

    setAnswers((previous) => {
      const existing = previous[questionId]?.value ?? "";
      const nextValue = `${existing} ${word}`.trim();
      const question = activeQuestions.find((item) => item.id === questionId);
      if (!question) return previous;

      return {
        ...previous,
        [questionId]: {
          questionId,
          value: nextValue,
          correct: getCorrectness(question, nextValue),
        },
      };
    });
  }

  function resetWordOrder(questionId: string) {
    const question = activeQuestions.find((item) => item.id === questionId);
    if (!question?.words) return;
    setWordBank((previous) => ({ ...previous, [questionId]: shuffle(question.words ?? []) }));
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[questionId];
      return next;
    });
  }

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} glass`}>
        <div className={styles.heroText}>
          <span className="eyebrow">12 времен в одной понятной системе</span>
          <h1>Английские времена: таблица и тренажёр</h1>
          <p>
            Одна страница, где можно увидеть формы `+ / - / ?`, выбрать несколько времён и проверить себя без
            длинного печатания.
          </p>

          <div className={styles.heroActions}>
            <button className="button button-primary" onClick={() => startSession("quick")} type="button">
              Начать быстрый тест
            </button>
            <button
              className="button button-outline"
              onClick={() => document.getElementById("trainer-zone")?.scrollIntoView({ behavior: "smooth" })}
              type="button"
            >
              Перейти к тренажёру
            </button>
          </div>

          <div className={styles.heroPills}>
            <StatPill label="Выбрано для старта" value={`${selection.selectedTenseIds.length}/4`} />
            <StatPill label="Всего вопросов" value={progress.totalQuestions} />
            <StatPill label="Точность" value={`${getAccuracy(progress.totalCorrect, progress.totalQuestions)}%`} />
          </div>
        </div>

        <div className={styles.heroAside}>
          <div className={styles.heroHeader}>
            <div>
              <div className={styles.brand}>временаванглийском.рф</div>
              <p className={styles.brandSubline}>Тренажёр для школьников 10–14 лет и начинающих</p>
            </div>
            <ThemeToggle theme={progress.theme} onToggle={updateTheme} />
          </div>

          <div className={styles.heroMiniPanel}>
            <h3>Сегодня полезно повторить</h3>
            <div className={styles.recommendations}>
              {recommended.map((tenseId) => (
                <button
                  key={tenseId}
                  className={`${styles.recommendationChip} ${
                    selection.selectedTenseIds.includes(tenseId) ? styles.recommendationChipActive : ""
                  }`}
                  onClick={() => toggleTense(tenseId)}
                  type="button"
                >
                  {tenseMap[tenseId].nameRu}
                </button>
              ))}
            </div>
            <button className="button button-soft" onClick={resetSelectionToRecommended} type="button">
              Взять рекомендованный набор
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={styles.utilityRow}>
          <div className={`${styles.utilityCard} glass`}>
            <span className="eyebrow">Как пользоваться</span>
            <h2>Сначала смотри таблицу, потом тренируй выбранные времена</h2>
            <p>
              Главное отличие этой версии: не нужно уходить на десятки страниц. Таблица, теория, выбор тем и
              сама тренировка собраны в одном рабочем экране.
            </p>
          </div>

          <div className={`${styles.utilityCard} glass`}>
            <span className="eyebrow">Панель прогресса</span>
            <div className={styles.utilityStats}>
              <StatPill label="Серия дней" value={progress.streak} />
              <StatPill label="Последний набор" value={progress.lastPracticedTenseIds.length || "—"} />
              <StatPill label="Сессий" value={progress.recentSessions.length} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={styles.tableIntro}>
          <div>
            <span className="eyebrow">Таблица 12 времен</span>
            <h2>Смотри утвердительные, отрицательные и вопросительные формы сразу</h2>
          </div>

          <div className={styles.filterStack}>
            <div className={styles.filterRow}>
              {tenseFamilies.map((family) => (
                <button
                  key={family.id}
                  className={`${styles.filterChip} ${
                    familyFilter === family.id ? styles.filterChipActive : ""
                  }`}
                  onClick={() => startTransition(() => setFamilyFilter(family.id as "all" | TenseFamily))}
                  type="button"
                >
                  {family.label}
                </button>
              ))}
            </div>
            <div className={styles.filterRow}>
              {tensePeriods.map((period) => (
                <button
                  key={period.id}
                  className={`${styles.filterChip} ${
                    periodFilter === period.id ? styles.filterChipActive : ""
                  }`}
                  onClick={() => startTransition(() => setPeriodFilter(period.id as "all" | TimePeriod))}
                  type="button"
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.tenseTableWrap} glass`}>
          <div className={styles.tableDesktop}>
            <table className={styles.tenseTable}>
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Когда использовать</th>
                  <th>+</th>
                  <th>-</th>
                  <th>?</th>
                  <th>В тренажёр</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenses.map((tense) => {
                  const selected = selection.selectedTenseIds.includes(tense.id);
                  const affirmativeExample = getFormExample(tense.examples, "affirmative");
                  const negativeExample = getFormExample(tense.examples, "negative");
                  const questionExample = getFormExample(tense.examples, "question");
                  return (
                    <tr key={tense.id} className={selected ? styles.tableRowActive : undefined}>
                      <td>
                        <strong>{tense.nameRu}</strong>
                        <span>{tense.nameEn}</span>
                      </td>
                      <td>{tense.shortRule}</td>
                      <td>
                        <div className={styles.formCell}>
                          <strong>{tense.formulas.affirmative}</strong>
                          <b>{affirmativeExample.en}</b>
                          <span>{affirmativeExample.ru}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.formCell}>
                          <strong>{tense.formulas.negative}</strong>
                          <b>{negativeExample.en}</b>
                          <span>{negativeExample.ru}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.formCell}>
                          <strong>{tense.formulas.question}</strong>
                          <b>{questionExample.en}</b>
                          <span>{questionExample.ru}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`${styles.pickButton} ${selected ? styles.pickButtonActive : ""}`}
                          onClick={() => toggleTense(tense.id)}
                          type="button"
                        >
                          {selected ? "Выбрано" : "Выбрать"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.tableMobile}>
            {filteredTenses.map((tense) => {
              const selected = selection.selectedTenseIds.includes(tense.id);
              const affirmativeExample = getFormExample(tense.examples, "affirmative");
              const negativeExample = getFormExample(tense.examples, "negative");
              const questionExample = getFormExample(tense.examples, "question");
              return (
                <article key={tense.id} className={styles.tenseCard}>
                  <div className={styles.tenseCardTop}>
                    <div>
                      <h3>{tense.nameRu}</h3>
                      <p>{tense.nameEn}</p>
                    </div>
                    <button
                      className={`${styles.pickButton} ${selected ? styles.pickButtonActive : ""}`}
                      onClick={() => toggleTense(tense.id)}
                      type="button"
                    >
                      {selected ? "В наборе" : "Добавить"}
                    </button>
                  </div>
                  <p>{tense.shortRule}</p>
                  <dl className={styles.tenseMeta}>
                    <div>
                      <dt>Утвердительная форма</dt>
                      <dd>
                        <strong>{tense.formulas.affirmative}</strong>
                        <span>{affirmativeExample.en}</span>
                        <small>{affirmativeExample.ru}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Отрицательная форма</dt>
                      <dd>
                        <strong>{tense.formulas.negative}</strong>
                        <span>{negativeExample.en}</span>
                        <small>{negativeExample.ru}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Вопросительная форма</dt>
                      <dd>
                        <strong>{tense.formulas.question}</strong>
                        <span>{questionExample.en}</span>
                        <small>{questionExample.ru}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Сигналы</dt>
                      <dd>{tense.signalWords.slice(0, 3).join(", ")}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="trainer-zone">
        <div className={styles.trainerLayout}>
          <div className={`${styles.trainerSidebar} glass`}>
            <span className="eyebrow">Настройка тренировки</span>
            <h2>Собери набор времён и выбери режим</h2>
            <p className="muted">
              Можно выбрать до четырёх времён. Если пока трудно, бери только одну группу и включай разминку `to be`.
            </p>

            <div className={styles.selectedWrap}>
              {selection.selectedTenseIds.map((tenseId) => (
                <span key={tenseId} className={styles.selectedBadge}>
                  {tenseMap[tenseId]?.nameRu}
                </span>
              ))}
              {selection.selectedTenseIds.length === 0 ? (
                <span className={styles.selectedBadge}>Пока ничего не выбрано</span>
              ) : null}
            </div>

            <label className={styles.toggleRow}>
              <input
                checked={selection.includeWarmup}
                onChange={(event) =>
                  setSelection((previous) => ({ ...previous, includeWarmup: event.target.checked }))
                }
                type="checkbox"
              />
              <span>Включить разминку `to be` перед основной тренировкой</span>
            </label>

            <div className={styles.modeList}>
              {modeOptions.map((mode) => (
                <button
                  key={mode.id}
                  className={`${styles.modeCard} ${
                    selection.mode === mode.id ? styles.modeCardActive : ""
                  }`}
                  onClick={() => setSelection((previous) => ({ ...previous, mode: mode.id }))}
                  type="button"
                >
                  <strong>{mode.label}</strong>
                  <span>{mode.description}</span>
                </button>
              ))}
            </div>

            <div className={styles.modeActions}>
              <button className="button button-primary" onClick={() => startSession(selection.mode)} type="button">
                Тренироваться по выбранным временам
              </button>
              <button className="button button-outline" onClick={() => startSession("weak_spots")} type="button">
                Повторить слабые места
              </button>
            </div>
          </div>

          <div className={`${styles.trainerStage} glass`}>
            {!currentQuestion && !sessionFinished ? (
              <div className={styles.placeholderStage}>
                <span className="eyebrow">Готов к запуску</span>
                <h2>Выбери времена и запусти первую сессию</h2>
                <p>
                  Для школьников лучше всего работает короткий ритм: 5–7 вопросов, потом быстрый разбор ошибок и
                  новая попытка.
                </p>

                <div className={styles.placeholderGrid}>
                  <div className={styles.placeholderCard}>
                    <strong>Сейчас выбрано</strong>
                    <p>{selectedStats.map((tense) => tense.nameRu).join(", ") || "Ничего не выбрано"}</p>
                  </div>
                  <div className={styles.placeholderCard}>
                    <strong>Рекомендуем начать</strong>
                    <p>{recommended.map((tenseId) => tenseMap[tenseId].nameRu).join(", ")}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {currentQuestion && !sessionFinished ? (
              <div className={styles.questionStage}>
                <div className={styles.questionTop}>
                  <div>
                    <span className="eyebrow">{answerToLabel(currentQuestion)}</span>
                    <h2>{currentQuestion.tenseName}</h2>
                  </div>
                  <div className={styles.progressInfo}>
                    <strong>
                      {currentIndex + 1} / {activeQuestions.length}
                    </strong>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressBarValue}
                        style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.questionCard}>
                  <p className={styles.questionPrompt}>
                    {currentQuestion.kind === "error_correction"
                      ? `Исправь ошибку: ${currentQuestion.incorrect}`
                      : currentQuestion.kind === "transform"
                        ? `${currentQuestion.prompt}: ${currentQuestion.source}`
                        : currentQuestion.prompt}
                  </p>

                  <div className={styles.clueBox}>
                    <strong>Подсказка</strong>
                    <p>{currentQuestion.clue}</p>
                    <p className="muted">Опорная формула: {currentQuestion.pattern}</p>
                  </div>

                  {currentQuestionOptions ? (
                    <div className={styles.optionsList}>
                      {currentQuestionOptions.map((choice) => {
                        const active = answers[currentQuestion.id]?.value === choice;
                        return (
                          <button
                            key={choice}
                            className={`${styles.optionButton} ${active ? styles.optionButtonActive : ""}`}
                            onClick={() => commitAnswer(choice)}
                            type="button"
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {currentQuestion.kind === "word_order" ? (
                    <div className={styles.wordOrderBox}>
                      <div className={styles.wordResult}>
                        <strong>Твоя версия:</strong>
                        <p>{answers[currentQuestion.id]?.value || "Пока пусто"}</p>
                      </div>
                      <div className={styles.wordActions}>
                        {(wordBank[currentQuestion.id] ?? []).map((word, index) => (
                          <button
                            key={`${word}-${index}`}
                            className={styles.wordToken}
                            onClick={() => moveWord(currentQuestion.id, word)}
                            type="button"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                      <button className="button button-outline" onClick={() => resetWordOrder(currentQuestion.id)} type="button">
                        Сбросить порядок
                      </button>
                    </div>
                  ) : null}

                  {answers[currentQuestion.id] ? (
                    <div
                      className={`${styles.feedbackBox} ${
                        answers[currentQuestion.id].correct ? styles.feedbackCorrect : styles.feedbackWrong
                      }`}
                    >
                      <strong>{answers[currentQuestion.id].correct ? "Верно" : "Есть ошибка"}</strong>
                      <p>
                        {answers[currentQuestion.id].correct
                          ? "Хорошо. Здесь важно запомнить именно форму предложения, а не просто узнать правило."
                          : `Правильный ответ: ${currentQuestion.answer}`}
                      </p>
                      <p className="muted">
                        Пример: {currentQuestion.example.en} — {currentQuestion.example.ru}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className={styles.questionFooter}>
                  <div className={styles.currentMeta}>
                    <div>
                      <strong>Типичная ошибка</strong>
                      <p>{tenseMap[currentQuestion.tenseId]?.commonMistakes[0] ?? "Путаница в форме или порядке слов"}</p>
                    </div>
                  </div>

                  <button
                    className="button button-secondary"
                    disabled={!answers[currentQuestion.id]}
                    onClick={nextQuestion}
                    type="button"
                  >
                    {currentIndex === activeQuestions.length - 1 ? "Показать результат" : "Следующий вопрос"}
                  </button>
                </div>
              </div>
            ) : null}

            {sessionFinished ? (
              <div className={styles.resultStage}>
                <span className="eyebrow">Сессия завершена</span>
                <h2>{selection.mode === "weak_spots" ? "Слабые места разобраны" : "Тренировка завершена"}</h2>
                <div className={styles.resultHero}>
                  <div>
                    <strong>{sessionSummary.accuracy}%</strong>
                    <span>точность за сессию</span>
                  </div>
                  <div>
                    <strong>{sessionSummary.correct}</strong>
                    <span>правильных ответов</span>
                  </div>
                  <div>
                    <strong>{sessionSummary.attempted}</strong>
                    <span>всего вопросов</span>
                  </div>
                </div>

                <div className={styles.resultGrid}>
                  <div className={styles.resultCard}>
                    <strong>Какие времена были в сессии</strong>
                    <p>{selection.selectedTenseIds.map((tenseId) => tenseMap[tenseId]?.nameRu).join(", ") || "Разминка To be"}</p>
                  </div>
                  <div className={styles.resultCard}>
                    <strong>Что повторить дальше</strong>
                    <p>
                      {progress.recentSessions[0]?.weakPatterns.join(", ") ||
                        "Сделай ещё одну короткую сессию по тем же временам, чтобы закрепить результат."}
                    </p>
                  </div>
                </div>

                <div className={styles.resultActions}>
                  <button className="button button-primary" onClick={() => startSession(selection.mode)} type="button">
                    Повторить в том же режиме
                  </button>
                  <button className="button button-outline" onClick={() => startSession("quick")} type="button">
                    Сделать короткую новую сессию
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={styles.dashboardGrid}>
          <div className={`${styles.dashboardCard} glass`}>
            <span className="eyebrow">Что уже сделано</span>
            <h2>Домашняя панель прогресса</h2>
            <div className={styles.dashboardStats}>
              <StatPill label="Сегодня тренировали" value={progress.lastPracticedTenseIds.length || "—"} />
              <StatPill label="Точность всего" value={`${getAccuracy(progress.totalCorrect, progress.totalQuestions)}%`} />
              <StatPill label="Серия" value={`${progress.streak} дн.`} />
            </div>

            <div className={styles.recentSessions}>
              {progress.recentSessions.length === 0 ? (
                <p className="muted">После первой сессии здесь появятся последние тренировки и слабые места.</p>
              ) : (
                progress.recentSessions.map((session) => (
                  <article key={session.id} className={styles.sessionCard}>
                    <div>
                      <strong>{session.label}</strong>
                      <p>{new Date(session.date).toLocaleDateString("ru-RU")}</p>
                    </div>
                    <div>
                      <strong>{session.accuracy}%</strong>
                      <p>{session.selectedTenseIds.map((tenseId) => tenseMap[tenseId]?.nameRu).join(", ")}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className={`${styles.dashboardCard} glass`}>
            <span className="eyebrow">Точность по временам</span>
            <h2>Где всё хорошо, а где лучше вернуться к формуле</h2>
            <div className={styles.overviewList}>
              {overviewStats.map((item) => (
                <article key={item.id} className={styles.overviewRow}>
                  <div>
                    <strong>{item.nameRu}</strong>
                    <p>{item.weakPattern ? `Часто путается: ${item.weakPattern}` : "Пока ошибок мало или ещё нет данных."}</p>
                  </div>
                  <div className={styles.overviewMetric}>
                    <strong>{item.accuracy}%</strong>
                    <span>{item.attempted} вопросов</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
