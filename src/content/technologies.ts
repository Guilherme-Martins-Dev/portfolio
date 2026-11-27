import { z } from "zod";

import { defineCollection, technologySchema } from "@/lib/schemas";

// Só tecnologias citadas nas notas dos projetos (docs/pesquisa/02-conteudo.md §2.3).
// Logos: simple-icons 14.0.0 (CC0; as marcas continuam de seus donos). React Three Fiber e CadQuery não têm logo oficial no pacote.
// TODO(guilherme): informar `status` (usada | conhecida | estudo) de cada uma e completar com a stack real de cada projeto (linguagens, frameworks, bancos, serviços de IA).
export const technologies = defineCollection("technologies", z.array(technologySchema), [
  { id: "react-three-fiber", name: "React Three Fiber", area: "3d" },
  { id: "cadquery", name: "CadQuery", area: "3d" },
  { id: "arduino", name: "Arduino", area: "hardware", logo: "/logos/arduino.svg" },
  { id: "moodle", name: "Moodle", area: "integracao", logo: "/logos/moodle.svg", destaque: true },
  { id: "whatsapp", name: "WhatsApp", area: "integracao", logo: "/logos/whatsapp.svg" },
]);
