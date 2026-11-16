"use client";

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

/**
 * Menu do celular (abaixo de `md`). O conteúdo (links) é renderizado no servidor e
 * passado como children; aqui fica só o estado de aberto/fechado.
 * Fecha ao escolher um link, com Esc (devolvendo o foco ao botão) e ao voltar para o desktop.
 */
export function MobileMenu({ children }: { children: ReactNode }) {
  const t = useTranslations("Layout");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 48rem)");
    function onBreakpoint() {
      if (desktop.matches) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <div className="md:hidden">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>
      <div
        id={panelId}
        hidden={!open}
        onClick={closeOnLink}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-b border-border bg-background px-6 py-6 shadow-lg"
      >
        {children}
      </div>
    </div>
  );
}
