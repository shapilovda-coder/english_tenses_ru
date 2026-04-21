export const metadata = {
  title: "Контакты | Tense Trainer",
  description: "Контакты проекта Tense Trainer.",
};

export default function ContactsPage() {
  return (
    <main className="shell section">
      <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: "1.4rem" }}>
        <span className="eyebrow">Contacts</span>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 4rem)", marginTop: "0.8rem" }}>Контакты</h1>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          <p className="muted">
            Проект развивается как учебный тренажёр по английским временам. По вопросам сотрудничества и
            размещения можно связаться по телефону ниже.
          </p>
          <a href="tel:+79055529581" style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--navy)" }}>
            +7 (905) 552-95-81
          </a>
          <p className="muted">Основной рабочий домен сейчас — временаванглийском.рф.</p>
        </div>
      </div>
    </main>
  );
}
