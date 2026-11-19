import { z } from "zod";

import { defineCollection, studySchema } from "@/lib/schemas";

// TODO(guilherme): cadastrar formação, cursos e certificações reais (instituição, título PT/EN, datas,
// link do certificado). Enquanto estiver vazio, a página Estudos mostra só o aviso de "em preparação".
export const studies = defineCollection("studies", z.array(studySchema), []);
