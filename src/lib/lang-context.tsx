"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Lang } from "./hetta-config";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextType>({
  lang: "en", setLang: () => {}, t: (k) => k, dir: "ltr",
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("hetta-lang") as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage, which is unavailable during render
    if (stored && translations[stored]) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("hetta-lang", l);
  };

  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir} style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', 'Inter', system-ui, sans-serif" : undefined }}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
