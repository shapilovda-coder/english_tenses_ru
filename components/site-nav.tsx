import Link from "next/link";

export function SiteNav() {
  return <nav className="topic-breadcrumbs" aria-label="Учебные темы">
    <Link href="/">Таблица 12 времён</Link>
    <Link href="/present-simple/">Present Simple</Link>
    <Link href="/present-continuous/">Present Continuous</Link>
    <Link href="/past-simple/">Past Simple</Link>
    <Link href="/present-simple-vs-present-continuous/">Сравнение времён</Link>
    <Link href="/to-be/">To be</Link>
  </nav>;
}
