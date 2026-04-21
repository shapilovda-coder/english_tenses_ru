export const metadata = {
  title: "Политика конфиденциальности | Tense Trainer",
  description: "Как Tense Trainer хранит локальный прогресс и использует данные в браузере.",
};

export default function PrivacyPage() {
  return (
    <main className="shell section">
      <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: "1.4rem" }}>
        <span className="eyebrow">Privacy</span>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", marginTop: "0.8rem" }}>Политика конфиденциальности</h1>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }} className="muted">
          <p>
            Tense Trainer не требует регистрации и не собирает личные данные через сервер. Вся статистика
            тренировок, выбранная тема и локальный прогресс сохраняются только в браузере пользователя через
            `localStorage`.
          </p>
          <p>
            Мы не обещаем синхронизацию между устройствами в этой версии. Если пользователь очистит данные
            браузера, локальный прогресс тоже будет удалён.
          </p>
          <p>
            Для связи по вопросам работы проекта можно использовать контактный телефон, указанный на странице
            контактов.
          </p>
        </div>
      </div>
    </main>
  );
}
