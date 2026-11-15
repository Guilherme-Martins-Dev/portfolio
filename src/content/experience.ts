import { z } from "zod";

import { defineCollection, experienceSchema } from "@/lib/schemas";

// TODO(guilherme): cadastrar a experiência real (organização, cargo, início, fim, descrição).
// Enquanto estiver vazio, o indicador "anos de experiência" não aparece.
export const experience = defineCollection("experience", z.array(experienceSchema), []);
