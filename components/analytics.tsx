"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CONSENT_KEY, METRIKA_ID, type MetrikaFunction } from "@/lib/analytics";

const changeEvent = "trainer-consent-change";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(changeEvent, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(changeEvent, listener); };
}
function getConsent() {
  try { return window.localStorage.getItem(CONSENT_KEY) ?? "unset"; } catch { return "denied"; }
}
function setConsent(choice: "granted" | "denied") {
  try { window.localStorage.setItem(CONSENT_KEY, choice); } catch { /* Practice works without analytics. */ }
  window.dispatchEvent(new Event(changeEvent));
  if (choice === "denied" && window.ym) window.location.reload();
}

export function Analytics() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => "unset");
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "granted" || window.location.hostname !== "xn--80aaebgia2ajkigjfdvu4a.xn--p1ai") return;
    if (!window.ym) {
      const queue: unknown[][] = [];
      const ym: MetrikaFunction = (...args) => { queue.push(args); };
      ym.a = queue; ym.l = Date.now(); window.ym = ym;
      const script = document.createElement("script");
      script.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;
      script.async = true; document.head.appendChild(script);
      ym(METRIKA_ID, "init", { defer: true, webvisor: false, clickmap: false, trackLinks: true, accurateTrackBounce: true });
    }
    if (lastPath.current !== pathname) {
      window.ym(METRIKA_ID, "hit", window.location.href, { title: document.title });
      lastPath.current = pathname;
    }
  }, [consent, pathname]);

  if (consent !== "unset") return null;
  return <aside className="consent-banner" aria-label="Настройки статистики">
    <p>Можно разрешить Яндекс.Метрику, чтобы помочь улучшить тренажёр. Прогресс сохраняется и без неё. <Link href="/privacy/">О данных</Link></p>
    <div><button type="button" className="button button-outline" onClick={() => setConsent("denied")}>Только тренажёр</button><button type="button" className="button button-secondary" onClick={() => setConsent("granted")}>Разрешить статистику</button></div>
  </aside>;
}

export function AnalyticsPreference() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => "unset");
  return <div className="stack"><p>Статистика: {consent === "granted" ? "разрешена" : consent === "denied" ? "выключена" : "выбор ещё не сделан"}.</p><div className="hero-actions"><button className="button button-outline" type="button" onClick={() => setConsent("denied")}>Выключить статистику</button><button className="button button-secondary" type="button" onClick={() => setConsent("granted")}>Разрешить статистику</button></div></div>;
}
