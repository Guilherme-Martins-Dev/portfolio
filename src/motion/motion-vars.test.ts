import { describe, expect, it } from "vitest";

import { scrollTriggerVars, tweenVars } from "./motion-vars";

describe("variáveis de movimento", () => {
  const trigger = { trigger: "#about", start: "top 80%", end: "bottom top", pin: true, pinSpacing: true, scrub: 1, snap: 0.5 };

  it("sem movimento reduzido, nada muda", () => {
    expect(scrollTriggerVars(trigger, false)).toBe(trigger);
    const vars = { y: 0, duration: 1, stagger: 0.1, scrollTrigger: trigger };
    expect(tweenVars(vars, false)).toBe(vars);
  });

  it("com movimento reduzido, o ScrollTrigger perde pin, scrub e snap e mantém o resto", () => {
    expect(scrollTriggerVars(trigger, true)).toEqual({ trigger: "#about", start: "top 80%", end: "bottom top" });
    // Não altera o objeto original.
    expect(trigger.pin).toBe(true);
  });

  it("com movimento reduzido, o tween vai direto ao estado final", () => {
    const vars = { opacity: 1, y: 0, duration: 1.2, delay: 0.3, stagger: 0.08, repeat: -1, yoyo: true, scrollTrigger: trigger };
    const safe = tweenVars(vars, true);
    expect(safe).toMatchObject({ opacity: 1, y: 0, duration: 0, delay: 0, stagger: 0, repeat: 0, yoyo: false });
    expect(safe.scrollTrigger).not.toHaveProperty("pin");
    expect(safe.scrollTrigger).not.toHaveProperty("scrub");
  });
});
