/**
 * Rate limit simples por chave (IP), em memória, com janela deslizante.
 * Limitação conhecida: na Vercel cada instância da função tem a própria memória, então o limite é
 * por instância. Para um portfólio isso basta como freio; o Turnstile é a barreira principal.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    /** Registra uma tentativa e diz se ela está dentro do limite. */
    check(key: string, now = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);

      // Evita que o Map cresça sem fim: de tempos em tempos descarta chaves sem tentativas recentes.
      if (hits.size > 1000) {
        for (const [other, times] of hits) if (times.every((time) => now - time >= windowMs)) hits.delete(other);
      }
      return true;
    },
  };
}

/** 5 envios a cada 10 minutos por IP. */
export const contactRateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
