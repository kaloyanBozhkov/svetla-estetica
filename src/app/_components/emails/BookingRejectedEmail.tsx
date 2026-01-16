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
  Link,
} from "@react-email/components";
import { BASE_URL } from "@/lib/constants";

interface BookingRejectedEmailProps {
  customerName: string;
  serviceName: string;
  serviceUuid: string;
  bookingDate: string;
  bookingTime: string;
}

export default function BookingRejectedEmail({
  customerName,
  serviceName,
  serviceUuid,
  bookingDate,
  bookingTime,
}: BookingRejectedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Aggiornamento sul tuo appuntamento - Svetla Estetica</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={`${BASE_URL}/logo-cropped.webp`}
              width="80"
              height="80"
              alt="Svetla Estetica"
              style={logo}
            />
            <Text style={brandName}>Svetla Estetica</Text>
          </Section>
          <Section style={box}>
            <Section style={warningBanner}>
              <table style={{ margin: "0 auto" }}>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#d97706",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin: 10px;"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
                      }}
                    />
                  </td>
                </tr>
              </table>
              <Text style={warningText}>Appuntamento Non Disponibile</Text>
            </Section>

            <Text style={paragraph}>Ciao {customerName},</Text>
            <Text style={paragraph}>
              Purtroppo non siamo in grado di confermare il tuo appuntamento
              per la data e l&apos;ora richieste.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsHeading}>Richiesta Originale</Text>
              <Hr style={detailsHr} />
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Trattamento</td>
                  <td style={detailsValue}>{serviceName}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Data richiesta</td>
                  <td style={detailsValue}>{bookingDate}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Ora richiesta</td>
                  <td style={detailsValue}>{bookingTime}</td>
                </tr>
              </table>
            </Section>

            <Text style={paragraph}>
              Ci scusiamo per l&apos;inconveniente! Puoi prenotare una nuova
              data direttamente online oppure contattarci per assistenza.
            </Text>

            <Button style={button} href={`${BASE_URL}/prenota/${serviceUuid}`}>
              Prenota una nuova data
            </Button>

            <Text style={smallText}>
              Hai bisogno di aiuto? Contattaci al{" "}
              <Link href="tel:+393935026350" style={link}>
                (+39) 393 5026 350
              </Link>{" "}
              oppure via{" "}
              <Link href="https://wa.me/393935026350" style={link}>
                WhatsApp
              </Link>
            </Text>

            <Hr style={hr} />
            <Text style={footer}>
              Svetla Estetica - Viale Natale Betelli, 51, 24044 Dalmine (BG)
              <br />
              Tel: (+39) 393 5026 350 | WhatsApp: (+39) 393 5026 350
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
  boxShadow: "0 4px 6px rgba(95, 40, 103, 0.1)",
};

const logoSection = {
  backgroundColor: "#5f2867",
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

const warningBanner = {
  backgroundColor: "#fef3c7",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center" as const,
  marginBottom: "24px",
  border: "1px solid #fcd34d",
};

const warningText = {
  color: "#b45309",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "12px 0 0 0",
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
  textAlign: "center" as const,
  margin: "16px 0",
};

const detailsBox = {
  backgroundColor: "#faf5fb",
  borderRadius: "10px",
  padding: "20px 24px",
  margin: "24px 0",
  border: "1px solid #e9d5ec",
};

const detailsHeading = {
  color: "#5f2867",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
};

const detailsHr = {
  borderColor: "#e9d5ec",
  margin: "12px 0",
};

const detailsTable = {
  width: "100%",
};

const detailsLabel = {
  color: "#6b7280",
  fontSize: "14px",
  padding: "6px 0",
  width: "40%",
};

const detailsValue = {
  color: "#374151",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "6px 0",
};

const button = {
  backgroundColor: "#5f2867",
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

const link = {
  color: "#5f2867",
  fontWeight: "600" as const,
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
};
