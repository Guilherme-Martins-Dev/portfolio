import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import en from "@/messages/en.json";
import pt from "@/messages/pt.json";

/**
 * Imagem Open Graph gerada no build, uma por idioma (#24). Vale para todas as páginas do idioma.
 * Cores da paleta-base (D10): #00E5FF só como detalhe, nunca em texto sobre fundo claro.
 * TODO(guilherme): trocar o "GMB" provisório pela logomarca final (#2) e incluir a foto (#4).
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Lido direto dos JSON: aqui o getTranslations cairia no next/root-params, que não existe
// no generateImageMetadata (ele roda como um generateStaticParams).
const messages = { pt: pt.Metadata, en: en.Metadata };

async function metadataMessages(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  return messages[hasLocale(routing.locales, locale) ? locale : routing.defaultLocale];
}

export async function generateImageMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const t = await metadataMessages(params);
  return [{ id: "default", alt: t.ogAlt, size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const t = await metadataMessages(params);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0B132B",
          color: "#F8FAFC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#00E5FF" }} />
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#A66BE0" }}>GMB</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 80, lineHeight: 1.05 }}>{t.title}</div>
          <div style={{ fontSize: 36, color: "#CBD5E1" }}>{t.ogTagline}</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 240, background: "#7B2CBF" }} />
      </div>
    ),
    size,
  );
}
