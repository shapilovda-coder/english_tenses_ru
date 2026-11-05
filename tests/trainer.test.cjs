const test = require("node:test");
const assert = require("node:assert/strict");
const load = require("./load-typescript.cjs");
const { buildQuestionSet, defaultProgress, applySessionResult } = load("lib/trainer.ts");
const { tenses } = load("content/tenses.ts");
const { comparisonPractice } = load("content/practice.ts");
const { toBeWarmupQuestions } = load("content/tobe-warmup.ts");
const { normalizeAnswer, isCorrectAnswer } = load("lib/answers.ts");
const selection = { selectedTenseIds: ["present_simple", "past_simple"], mode: "quick", includeWarmup: true };

test("standalone to be has only be questions and counts every answer", () => {
  const mode = { ...selection, mode: "tobe_warmup", includeWarmup: false };
  const questions = buildQuestionSet(mode, defaultProgress);
  assert.equal(questions.length, 12);
  assert.ok(questions.every((q) => q.tenseId === "tobe_warmup"));
  const result = applySessionResult(defaultProgress, mode, questions.map((question) => ({ question, correct: true })));
  assert.equal(result.totalQuestions, 12);
  assert.equal(result.recentSessions[0].accuracy, 100);
});

test("standard session fills twelve unique slots even with one selected core tense", () => {
  for (const ids of [["present_simple"], ["past_simple", "present_continuous"]]) {
    const questions = buildQuestionSet({ ...selection, mode: "standard", selectedTenseIds: ids }, defaultProgress);
    assert.equal(questions.length, 12);
    assert.equal(new Set(questions.map((q) => q.id)).size, 12);
    assert.ok(questions.slice(0, 2).every((q) => q.tenseId === "tobe_warmup"));
  }
});

test("quick mixed practice covers every selected tense without repeated questions", () => {
  const ids = ["present_simple", "past_simple", "present_continuous", "present_perfect"];
  for (let i = 0; i < 20; i++) {
    const questions = buildQuestionSet({ ...selection, selectedTenseIds: ids }, defaultProgress);
    assert.equal(questions.length, 6);
    assert.ok(ids.every((id) => questions.some((q) => q.tenseId === id)));
    assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  }
});

test("weak spots repeat the error skill rather than unrelated questions from that tense", () => {
  const question = buildQuestionSet({ ...selection, selectedTenseIds: ["present_simple"], includeWarmup: false }, defaultProgress)[0];
  const progress = applySessionResult(defaultProgress, selection, [{ question, correct: false }]);
  const repeated = buildQuestionSet({ ...selection, mode: "weak_spots" }, progress);
  assert.ok(repeated.length > 0);
  assert.ok(repeated.every((q) => q.pattern === question.pattern && q.tenseId === question.tenseId));
  const corrected = applySessionResult(progress, selection, [{ question, correct: true }]);
  assert.equal(corrected.tenseStats[question.tenseId].mistakes[question.pattern], 0);
  assert.equal(progress.tenseStats[question.tenseId].mistakes[question.pattern], 1);
});

test("comparison practice stays within its topic and includes both target tenses", () => {
  for (const [practiceId, pool] of Object.entries(comparisonPractice)) {
    const ids = [...new Set(pool.map((q) => q.tenseId))];
    const questions = buildQuestionSet({ ...selection, selectedTenseIds: ids, practiceId }, defaultProgress);
    assert.equal(questions.length, 6);
    assert.ok(questions.every((q) => pool.some((p) => p.id === q.id)));
    assert.ok(ids.every((id) => questions.some((q) => q.tenseId === id)));
  }
});

test("answer matching accepts case, punctuation and common negative contractions", () => {
  const q = { answer: "She does not play chess." };
  assert.ok(isCorrectAnswer(q, "  SHE DOESN’T PLAY CHESS! "));
  assert.ok(!isCorrectAnswer(q, "She plays chess."));
  assert.equal(normalizeAnswer("They weren't ready."), "they were not ready");
});

test("question banks have valid unique answers, IDs and word-order tokens", () => {
  const ids = new Set();
  const rows = [...tenses.flatMap((t) => t.exerciseTemplates.map((q) => ({ ...q, id: `${t.id}-${q.id}` }))), ...toBeWarmupQuestions, ...Object.values(comparisonPractice).flat()];
  for (const q of rows) {
    assert.ok(q.answer && q.clue && q.prompt, q.id);
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`); ids.add(q.id);
    if (q.choices) {
      assert.ok(q.choices.some((choice) => normalizeAnswer(choice) === normalizeAnswer(q.answer)), q.id);
      assert.equal(new Set(q.choices.map(normalizeAnswer)).size, q.choices.length, q.id);
    }
    if (q.words) assert.deepEqual(q.words.map(normalizeAnswer).sort(), normalizeAnswer(q.answer).split(" ").sort(), q.id);
  }
});
