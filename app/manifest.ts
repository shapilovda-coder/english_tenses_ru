import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tense Trainer",
    short_name: "Tense Trainer",
    description: "Тренажер английских времен с общей таблицей, упражнениями и локальным прогрессом.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe6",
    theme_color: "#143a52",
    lang: "ru",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
