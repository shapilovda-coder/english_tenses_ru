import Link from "next/link";

import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={`${styles.inner} glass`}>
          <div>
            <span className="eyebrow">Tense Trainer 2.0</span>
            <h2>Один экран, где можно и понять правило, и сразу себя проверить</h2>
            <p>
              Проект сделан как быстрый учебный инструмент: без аккаунтов, без лишней рекламы и без беготни по
              десяткам страниц.
            </p>
          </div>

          <div className={styles.links}>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/contacts">Контакты</Link>
            <a href="tel:+79055529581">+7 (905) 552-95-81</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
