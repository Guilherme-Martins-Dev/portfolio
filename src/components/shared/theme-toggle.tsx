"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY } from "./theme-script";

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage indisponível (modo privado): o tema vale só para esta página.
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label={t("label")}>
      <Sun className="dark:hidden" aria-hidden="true" />
      <Moon className="hidden dark:block" aria-hidden="true" />
    </Button>
  );
}
