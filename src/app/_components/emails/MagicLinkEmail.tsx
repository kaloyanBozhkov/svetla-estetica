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
} from "@react-email/components";

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
          <Section style={box}>
            <Text style={heading}>Svetla Estetica</Text>
            <Hr style={hr} />
            <Text style={paragraph}>Ciao!</Text>
            <Text style={paragraph}>
              Hai richiesto un link di accesso al tuo account Svetla Estetica.
              Clicca il pulsante qui sotto per accedere:
            </Text>
            <Button style={button} href={magicLinkUrl}>
              Accedi al tuo account
            </Button>
            <Text style={paragraph}>
              Questo link scadrà tra 15 minuti. Se non hai richiesto questo
              link, puoi ignorare questa email.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              Svetla Estetica - Via Example 123, Dalmine (BG)
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fdfbf9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  color: "#cb4537",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#cb4537",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

