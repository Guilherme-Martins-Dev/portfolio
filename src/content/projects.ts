import { z } from "zod";

import { defineCollection, projectSchema } from "@/lib/schemas";

// Fonte: docs/pesquisa/02-conteudo.md §2.3 (só o que é público). Datas, links e stack completa
// ainda não estão documentados no repositório e por isso ficam ausentes (não aparecem no site).
// TODO(guilherme): para cada projeto, informar início/fim, links (repositório, demo) e a stack completa.
// TODO(guilherme): o "Portfólio para cliente" só entra com autorização do cliente.
export const projects = defineCollection("projects", z.array(projectSchema), [
  {
    slug: "questum",
    title: "Questum",
    summary: {
      pt: "Converte provas em .docx para o Moodle com IA, com questões no padrão ENEM. Projeto de extensão com 8 integrantes.",
      en: "Uses AI to convert .docx exams into Moodle, with questions in the ENEM format. University extension project with 8 members.",
    },
    status: "em-desenvolvimento",
    featured: true,
    technologies: ["moodle"],
    teamSize: 8,
  },
  {
    slug: "neurosim-3d",
    title: "NeuroSim 3D",
    summary: {
      pt: "Simulador 3D de exame neurológico.",
      en: "3D simulator of a neurological examination.",
    },
    // TODO(guilherme): confirmar a situação do resumo para a AMEE (submetido/aceito) antes de citá-lo.
    status: "em-desenvolvimento",
    featured: true,
  },
  {
    slug: "ai-discovery",
    title: "AI Discovery",
    summary: {
      pt: "Diagnóstico de IA por QR Code e telão, apresentado na Feira do Conhecimento.",
      en: "AI diagnosis via QR code and a big screen, presented at the Feira do Conhecimento.",
    },
    // TODO(guilherme): o projeto está no ar; informar o link da demo.
    status: "concluido",
    featured: true,
  },
  {
    slug: "chatbot-whatsapp-lead-intelligence",
    title: "Chatbot WhatsApp + Lead Intelligence",
    summary: {
      pt: "Chatbot no WhatsApp e painel de inteligência de leads para um cliente.",
      en: "WhatsApp chatbot and lead intelligence dashboard for a client.",
    },
    status: "em-desenvolvimento",
    featured: true,
    confidential: true,
    technologies: ["whatsapp"],
  },
  {
    slug: "bancada-4wd",
    title: "Bancada 4WD",
    summary: {
      pt: "Montagem 3D de um carro robô Arduino no navegador.",
      en: "In-browser 3D assembly of an Arduino robot car.",
    },
    status: "em-desenvolvimento",
    featured: false,
    technologies: ["react-three-fiber", "cadquery", "arduino"],
  },
  {
    slug: "biblioteca-itia",
    title: "Biblioteca ITIA",
    summary: {
      pt: "Plataforma educacional em produção.",
      en: "Educational platform in production.",
    },
    // TODO(guilherme): a pesquisa diz "concluído / em evolução"; confirmar o status.
    status: "concluido",
    featured: false,
  },
]);
