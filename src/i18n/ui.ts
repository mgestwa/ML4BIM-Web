export type Locale = "pl" | "en";

const ui = {
  pl: {
    "site.title": "ML4BIM | AI/ML dla inżynierów MEP",
    "site.description":
      "Wprowadzenie inżynierów instalacji do świata AI i uczenia maszynowego — praktyczne wpisy, tutoriale i eksperymenty z danymi BIM.",

    "nav.journal": "Dziennik",
    "nav.about": "O projekcie",
    "nav.github": "GitHub",

    "hero.badge": "BIM · MEP / HVAC · AI & ML",
    "hero.heading.line1": "AI & ML",
    "hero.heading.line2": "w świecie MEP",
    "hero.subtitle": "Nowe narzędzia dla inżynierów instalacji",
    "hero.cta.journal": "Czytaj dziennik",
    "hero.cta.github": "Repozytorium GitHub",

    "hero.pipeline.step1": "BIM / IFC",
    "hero.pipeline.step2": "Python",
    "hero.pipeline.step3": "Machine Learning",
    "hero.pipeline.step4": "Praktyka",
    "hero.pipeline.label": "Ścieżka nauki",

    "posts.heading": "Ostatnie",
    "posts.heading.accent": "wpisy",
    "posts.all": "Wszystkie wpisy",
    "posts.empty": "Wkrótce pojawią się pierwsze wpisy.",

    "about.heading.prefix": "O",
    "about.heading.accent": "projekcie",
    "about.text":
      "ML4BIM to otwarta platforma edukacyjna dla inżynierów instalacji (MEP/HVAC), którzy chcą wejść w świat sztucznej inteligencji i uczenia maszynowego. Publikujemy praktyczne wpisy, tutoriale i eksperymenty — od podstaw Pythona po realne zastosowania ML w branży BIM. Wszystko opisane krok po kroku, bez zbędnego żargonu.",

    "journal.title": "Dziennik",
    "journal.title.accent": "Badawczy",
    "journal.description": "Kronika projektu ML4BIM — od surowych danych IFC po modele ML.",
    "journal.back": "Wróć do dziennika",

    "quote.text": "The best way to predict the future is to invent it.",
    "quote.author": "Alan Kay",

    "footer.copyright": "ML4BIM",

    "lang.switch": "EN",
    "lang.label": "English version",
  },
  en: {
    "site.title": "ML4BIM | AI/ML for MEP Engineers",
    "site.description":
      "Introducing building services engineers to AI and machine learning — hands-on posts, tutorials and experiments with BIM data.",

    "nav.journal": "Journal",
    "nav.about": "About",
    "nav.github": "GitHub",

    "hero.badge": "BIM · MEP / HVAC · AI & ML",
    "hero.heading.line1": "AI & ML",
    "hero.heading.line2": "in MEP engineering",
    "hero.subtitle": "Bridging data science and building services",
    "hero.cta.journal": "Read the journal",
    "hero.cta.github": "GitHub repository",

    "hero.pipeline.step1": "BIM / IFC",
    "hero.pipeline.step2": "Python",
    "hero.pipeline.step3": "Machine Learning",
    "hero.pipeline.step4": "Practice",
    "hero.pipeline.label": "Learning path",

    "posts.heading": "Latest",
    "posts.heading.accent": "posts",
    "posts.all": "All posts",
    "posts.empty": "First posts coming soon.",

    "about.heading.prefix": "About the",
    "about.heading.accent": "project",
    "about.text":
      "ML4BIM is an open educational platform for MEP/HVAC engineers who want to explore artificial intelligence and machine learning. We publish hands-on posts, tutorials and experiments — from Python basics to real-world ML applications in the BIM industry. Step by step, no jargon.",

    "journal.title": "Research",
    "journal.title.accent": "Journal",
    "journal.description": "The ML4BIM chronicle — from raw IFC data to ML models.",
    "journal.back": "Back to journal",

    "quote.text": "The best way to predict the future is to invent it.",
    "quote.author": "Alan Kay",

    "footer.copyright": "ML4BIM",

    "lang.switch": "PL",
    "lang.label": "Wersja polska",
  },
} as const;

export type TranslationKey = keyof (typeof ui)["pl"];

export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    return ui[locale][key] ?? ui.pl[key];
  };
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split("/");
  if (segment === "en") return "en";
  return "pl";
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/en/, "").replace(/^\/$/, "") || "/";
  if (locale === "pl") return cleanPath;
  return `/en${cleanPath === "/" ? "" : cleanPath}`;
}
