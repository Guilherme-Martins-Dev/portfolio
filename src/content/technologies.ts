import { z } from "zod";

import { defineCollection, technologySchema } from "@/lib/schemas";

// Só tecnologias citadas nas notas dos projetos (docs/pesquisa/02-conteudo.md §2.3).
// TODO(guilherme): completar com a stack real de cada projeto (linguagens, frameworks, bancos, serviços de IA).
export const technologies = defineCollection("technologies", z.array(technologySchema), [
  { id: "react-three-fiber", name: "React Three Fiber", area: "3d" },
  { id: "cadquery", name: "CadQuery", area: "3d" },
  { id: "arduino", name: "Arduino", area: "hardware" },
  { id: "moodle", name: "Moodle", area: "integracao" },
  { id: "whatsapp", name: "WhatsApp", area: "integracao" },
]);
