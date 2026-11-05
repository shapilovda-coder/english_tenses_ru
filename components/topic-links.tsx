import Link from "next/link";
import { topics } from "@/content/topics";

export function TopicLinks({ slugs }: { slugs?: string[] }) {
  const shown = slugs ? topics.filter((topic) => slugs.includes(topic.slug)) : topics;
  return <div className="topic-grid">{shown.map((topic) => (
    <Link className="topic-link" key={topic.slug} href={`/${topic.slug}/`}>
      <strong>{topic.heading}</strong><span>{topic.level} · правило, практика и разбор ошибок</span>
    </Link>
  ))}</div>;
}
