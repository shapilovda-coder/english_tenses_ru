import Link from "next/link";

import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={`${styles.inner} glass`}>
          <div>
            <span className="eyebrow">Tense Trainer 2.0</span>
            <h2>Понятное правило и практика — шаг за шагом</h2>
            <p>
              Короткие тренировки по английским временам. Выбирай тему, разбирай ошибки и возвращайся к практике в удобном темпе.
            </p>
          </div>

          <div className={styles.links}>
            <Link href="/">Таблица всех времён</Link>
            <Link href="/present-simple-vs-present-continuous/">Сравнение времён</Link>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/contacts">Контакты</Link>
            <a href="tel:+79055529581">+7 (905) 552-95-81</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
