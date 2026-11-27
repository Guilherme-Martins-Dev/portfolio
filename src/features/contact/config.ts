/**
 * Configuração do formulário de contato (#26). Só existe quando as quatro variáveis estão definidas;
 * sem elas a página Contato mostra apenas o e-mail e os perfis, e a Server Action recusa o envio.
 * As variáveis ficam na Vercel (#29), nunca no repositório. Ver .env.example.
 */
export type ContactConfig = {
  resendApiKey: string;
  to: string;
  from: string;
  turnstileSiteKey: string;
  turnstileSecretKey: string;
};

/**
 * Remetente de teste do Resend: só entrega para o e-mail da própria conta Resend.
 * Em produção use CONTACT_FROM_EMAIL com um domínio verificado no Resend.
 */
export const DEFAULT_CONTACT_FROM = "Portfólio <onboarding@resend.dev>";

const read = (name: string) => process.env[name]?.trim() || undefined;

export function getContactConfig(): ContactConfig | null {
  const resendApiKey = read("RESEND_API_KEY");
  const to = read("CONTACT_TO_EMAIL");
  const turnstileSiteKey = read("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const turnstileSecretKey = read("TURNSTILE_SECRET_KEY");
  if (!resendApiKey || !to || !turnstileSiteKey || !turnstileSecretKey) return null;

  return { resendApiKey, to, from: read("CONTACT_FROM_EMAIL") ?? DEFAULT_CONTACT_FROM, turnstileSiteKey, turnstileSecretKey };
}
