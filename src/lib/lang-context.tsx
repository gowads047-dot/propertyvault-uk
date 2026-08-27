"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Lang } from "./makan-config";

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
    // Falls back to the old key so the rename does not silently reset the
    // language for anyone who had already chosen Arabic, and migrates them
    // forward on read so the fallback can be deleted later.
    const stored = (localStorage.getItem("makan-lang")
      ?? localStorage.getItem("hetta-lang")) as Lang | null;
    if (stored && translations[stored]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage, which is unavailable during render
      setLangState(stored);
      localStorage.setItem("makan-lang", stored);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("makan-lang", l);
  };

  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir} style={{ fontFamily: lang === "ar" ? "var(--font-noto-arabic), var(--font-inter), system-ui, sans-serif" : undefined }}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
