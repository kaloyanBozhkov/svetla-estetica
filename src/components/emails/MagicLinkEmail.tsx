import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
} from "@react-email/components";
import { BASE_URL } from "@/lib/constants";

interface MagicLinkEmailProps {
  magicLinkUrl: string;
}

export default function MagicLinkEmail({ magicLinkUrl }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Il tuo link di accesso a Svetla Estetica</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={`${BASE_URL}/logo-cropped-bg.webp`}
              width="80"
              height="80"
              alt="Svetla Estetica"
              style={logo}
            />
            <Text style={brandName}>Svetla Estetica</Text>
          </Section>
          <Section style={box}>
            <Hr style={hr} />
            <Text style={paragraph}>Ciao!</Text>
            <Text style={paragraph}>
              Hai richiesto un link di accesso al tuo account Svetla Estetica.
              Clicca il pulsante qui sotto per accedere:
            </Text>
            <Button style={button} href={magicLinkUrl}>
              Accedi al tuo account
            </Button>
            <Text style={smallText}>
              Questo link scadrà tra 15 minuti. Se non hai richiesto questo
              link, puoi ignorare questa email.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              Svetla Estetica - Viale Natale Betelli, 51, 24044 Dalmine (BG)
              <br />
              Tel: (+39) 393 5026 350
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f0f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "12px",
  marginTop: "40px",
  marginBottom: "40px",
  boxShadow: "0 4px 6px rgba(125, 85, 128, 0.1)",
};

const logoSection = {
  backgroundColor: "#7d5580",
  padding: "32px 48px",
  textAlign: "center" as const,
  borderRadius: "12px 12px 0 0",
};

const logo = {
  margin: "0 auto",
  borderRadius: "12px",
};

const brandName = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "16px 0 0 0",
};

const box = {
  padding: "32px 48px",
};

const hr = {
  borderColor: "#e9d5ec",
  margin: "24px 0",
};

const paragraph = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const button = {
  backgroundColor: "#7d5580",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 28px",
  margin: "28px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
};
