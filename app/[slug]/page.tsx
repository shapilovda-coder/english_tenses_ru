import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrainerApp } from "@/components/trainer-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { TopicLinks } from "@/components/topic-links";
import { topics, topicMap } from "@/content/topics";

export const dynamicParams = false;
export function generateStaticParams() { return topics.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicMap[slug];
  if (!topic) return {};
  return {
    title: `${topic.title} | Tense Trainer`, description: topic.description,
    alternates: { canonical: `/${slug}/` },
    openGraph: { title: topic.title, description: topic.description, url: `/${slug}/`, type: "website", locale: "ru_RU", images: ["/og-image.svg"] },
    twitter: { card: "summary_large_image", title: topic.title, description: topic.description, images: ["/og-image.svg"] },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topicMap[slug];
  if (!topic) notFound();
  const base = "https://xn--80aaebgia2ajkigjfdvu4a.xn--p1ai";
  const schema = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Английские времена", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: topic.heading, item: `${base}/${slug}/` },
      ] },
      { "@type": "FAQPage", mainEntity: topic.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
    ],
  };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <div className="shell">
      <SiteNav />
      <nav className="topic-breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Английские времена</Link><span aria-hidden="true">/</span><span>{topic.heading}</span></nav>
      <header className="topic-section glass">
        <span className="eyebrow">{topic.level} · Бесплатная практика</span>
        <h1 className="topic-title">{topic.heading}</h1>
        <p>{topic.intro}</p>
      </header>
      <TrainerApp initialTenseIds={topic.tenseIds} initialMode={topic.mode} practiceId={topic.practiceId} compact />
      <section className="topic-section glass section" aria-labelledby="short-rule">
        <h2 id="short-rule">Правило перед следующей попыткой</h2>
        {topic.rules.map((rule) => <div key={rule.heading}><h3>{rule.heading}</h3><p>{rule.text}</p></div>)}
        <div className="rule-table-wrap"><table className="rule-table"><caption>Примеры с переводом</caption><thead><tr><th>Ситуация</th><th>Пример</th><th>Перевод</th></tr></thead><tbody>{topic.examples.map(([label, en, ru]) => <tr key={label}><td>{label}</td><td lang="en">{en}</td><td>{ru}</td></tr>)}</tbody></table></div>
      </section>
      <section className="section"><div className="topic-section glass"><h2>Частые ошибки</h2><ul>{topic.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul><p>После разбора попробуй новую короткую сессию. Цель — применить правило к новому примеру.</p></div></section>
      <section className="section"><div className="topic-section glass"><h2>Вопросы по теме</h2>{topic.faq.map((item) => <details className="faq-item" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
      <section className="section"><div className="topic-section glass"><h2>Что потренировать дальше</h2><p className="muted" style={{margin: "1rem 0"}}>Выбери соседнюю тему или сравни два времени в одной сессии.</p><TopicLinks slugs={topic.related} /></div></section>
    </div>
    <SiteFooter />
  </main>;
}
