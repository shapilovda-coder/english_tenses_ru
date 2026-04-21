import { SiteFooter } from "@/components/site-footer";
import { TrainerApp } from "@/components/trainer-app";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Можно ли тренировать сразу несколько английских времен?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. В тренажере можно выбрать до четырех времен и пройти смешанную тренировку в одной сессии.",
      },
    },
    {
      "@type": "Question",
      name: "Подходит ли тренажер для школьников?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. Интерфейс рассчитан на школьников 10–14 лет: крупная таблица, короткие подсказки и понятные режимы тренировки.",
      },
    },
    {
      "@type": "Question",
      name: "Есть ли таблица всех 12 времен?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. На главной странице есть наглядная таблица всех 12 английских времен с формулами, примерами и сигнальными словами.",
      },
    },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tense Trainer",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  inLanguage: "ru",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
  },
  description:
    "Тренажер английских времен: таблица всех 12 времен, упражнения, смешанные тренировки и повтор слабых мест.",
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <main>
        <div className="shell">
          <TrainerApp />
        </div>

        <section className="section">
          <div className="shell">
            <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: "1.4rem" }}>
              <span className="eyebrow">Что это за проект</span>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)", marginTop: "0.8rem" }}>
                Английские времена — это не 12 несвязанных тем, а одна логичная система
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 0.9fr",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  <p className="muted">
                    Сильная сторона тренажёра в том, что он не заставляет учить времена изолированно. Ученик
                    сначала видит общую таблицу, понимает логику `Simple / Continuous / Perfect / Perfect
                    Continuous`, а потом проверяет себя на реальных упражнениях.
                  </p>
                  <p className="muted">
                    Такой формат особенно полезен тем, кто постоянно путает времена между собой: например,
                    `Present Simple` и `Present Continuous`, или `Past Simple` и `Present Perfect`.
                  </p>
                </div>
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  <p className="muted">
                    На странице можно сразу выбрать несколько времен, пройти короткий тест, посмотреть слабые
                    места и тут же вернуться к формуле. Это помогает не просто “узнавать” правило, а реально
                    закреплять его в практике.
                  </p>
                  <p className="muted">
                    Для SEO это тоже полезно: поисковик видит на странице не только интерфейс, но и настоящий
                    учебный контент — таблицу, объяснения, FAQ и упражнения.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
