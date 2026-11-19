"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  email: string;
  labels: { copy: string; copied: string; copyFailed: string };
};

type Status = "idle" | "copied" | "failed";

/** Copia o texto e diz se deu certo. Falha (sem permissão, contexto inseguro, API ausente) vira "failed". */
export async function copyText(text: string, clipboard: Pick<Clipboard, "writeText"> | undefined): Promise<Status> {
  try {
    if (!clipboard) return "failed";
    await clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

/**
 * E-mail como texto selecionável (funciona sem JavaScript) + botão que copia para a área de transferência.
 * O resultado é anunciado numa região `aria-live`; se a cópia falhar, o texto continua lá para copiar à mão.
 */
export function CopyEmail({ email, labels }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    setStatus(await copyText(email, navigator.clipboard));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${email}`}
          data-contact-email
          className="select-all break-all font-mono text-lg text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring sm:text-xl"
        >
          {email}
        </a>
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          {status === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {labels.copy}
        </Button>
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {status === "copied" ? labels.copied : status === "failed" ? labels.copyFailed : ""}
      </p>
    </div>
  );
}
