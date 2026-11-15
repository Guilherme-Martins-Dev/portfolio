import { z } from "zod";

import { defineCollection, eventSchema } from "@/lib/schemas";

// TODO(guilherme): cadastrar os eventos reais (nome, data, local, papel, links).
// Já se sabe que o AI Discovery foi apresentado na Feira do Conhecimento (02-conteudo §2.4), mas faltam
// a data e o papel (participante, organizador...). Quando houver, ligar com `relatedProject: "ai-discovery"`.
export const events = defineCollection("events", z.array(eventSchema), []);
