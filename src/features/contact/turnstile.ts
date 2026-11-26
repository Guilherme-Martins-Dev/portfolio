const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** O Cloudflare documenta tokens de até 2048 caracteres, válidos por 300 s e de uso único. */
const MAX_TOKEN_LENGTH = 2048;

/**
 * Valida no servidor o token do Cloudflare Turnstile (o widget sozinho não protege nada).
 * Qualquer falha (token ausente, rede, timeout, resposta inválida) conta como reprovação.
 */
export async function verifyTurnstile(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  if (!token || token.length > MAX_TOKEN_LENGTH) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: unknown };
    return result.success === true;
  } catch {
    return false;
  }
}
