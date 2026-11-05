import type { Metadata, Viewport } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";

import "./globals.css";
import { Analytics } from "@/components/analytics";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
});

const siteUrl = "https://xn--80aaebgia2ajkigjfdvu4a.xn--p1ai";
const title = "Английские времена: таблица и тренажёр онлайн | Tense Trainer";
const description =
  "Тренажер английских времен для школьников и начинающих: 12 времен в одной таблице, упражнения, смешанные тренировки и понятные подсказки.";

export const metadata: Metadata = {
  verification: { yandex: "95ee14007660b878" },
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Tense Trainer",
  keywords: [
    "английские времена",
    "таблица английских времен",
    "тренажер английских времен",
    "упражнения на времена английского",
    "present simple",
    "present perfect",
    "past simple"
  ],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Tense Trainer",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Tense Trainer — английские времена без зубрежки",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#143a52",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${manrope.variable} ${sourceSerif.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
