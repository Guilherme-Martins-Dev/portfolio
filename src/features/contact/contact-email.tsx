import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "react-email";

import type { ContactInput } from "./contact-schema";

type Props = ContactInput & { locale: string };

const colors = { navy: "#0B132B", text: "#1f2937", muted: "#4b5563", border: "#e5e7eb" };

/** E-mail (React Email) que chega para o Guilherme quando alguém usa o formulário de contato. */
export function ContactEmail({ name, email, message, locale }: Props) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{`Nova mensagem de ${name} pelo portfólio`}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", color: colors.text }}>
        <Container style={{ maxWidth: "560px", padding: "24px" }}>
          <Heading as="h1" style={{ fontSize: "20px", color: colors.navy, margin: "0 0 16px" }}>
            Nova mensagem pelo portfólio
          </Heading>
          <Section>
            <Text style={{ margin: "0 0 4px" }}>
              <strong>Nome:</strong> {name}
            </Text>
            <Text style={{ margin: "0 0 4px" }}>
              <strong>E-mail:</strong> <Link href={`mailto:${email}`}>{email}</Link>
            </Text>
            <Text style={{ margin: "0", color: colors.muted }}>Idioma do site: {locale}</Text>
          </Section>
          <Hr style={{ borderColor: colors.border, margin: "16px 0" }} />
          <Text style={{ whiteSpace: "pre-wrap", margin: 0 }}>{message}</Text>
          <Hr style={{ borderColor: colors.border, margin: "16px 0" }} />
          <Text style={{ fontSize: "12px", color: colors.muted, margin: 0 }}>
            Responda este e-mail para falar direto com {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
