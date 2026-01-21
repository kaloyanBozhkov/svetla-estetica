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
} from '@react-email/components';
import { BASE_URL } from '@/lib/constants';

interface BookingApprovedEmailProps {
  customerName: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
}

export default function BookingApprovedEmail({
  customerName,
  serviceName,
  bookingDate,
  bookingTime,
  duration,
}: BookingApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Il tuo appuntamento è stato confermato! - Svetla Estetica</Preview>
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
            <Section style={successBanner}>
              <Text style={successText}>Appuntamento Confermato</Text>
            </Section>

            <Text style={paragraph}>Ciao {customerName}!</Text>
            <Text style={paragraph}>
              Siamo lieti di confermarti che il tuo appuntamento è stato approvato. Ti aspettiamo!
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsHeading}>Dettagli Appuntamento</Text>
              <Hr style={detailsHr} />
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Trattamento</td>
                  <td style={detailsValue}>{serviceName}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Data</td>
                  <td style={detailsValue}>{bookingDate}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Ora</td>
                  <td style={detailsValue}>{bookingTime}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Durata</td>
                  <td style={detailsValue}>{duration} minuti</td>
                </tr>
              </table>
            </Section>

            <Text style={smallText}>
              Se hai bisogno di modificare o cancellare l&apos;appuntamento, contattaci il prima
              possibile.
            </Text>

            <Button style={button} href="tel:+393935026350">
              Chiamaci
            </Button>

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
  backgroundColor: '#f5f0f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '12px',
  marginTop: '40px',
  marginBottom: '40px',
  boxShadow: '0 4px 6px rgba(125, 85, 128, 0.1)',
};

const logoSection = {
  backgroundColor: '#7d5580',
  padding: '32px 48px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const logo = {
  margin: '0 auto',
  borderRadius: '12px',
};

const brandName = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0 0 0',
};

const box = {
  padding: '32px 48px',
};

const successBanner = {
  backgroundColor: '#ecfdf5',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center' as const,
  marginBottom: '24px',
  border: '1px solid #a7f3d0',
};

const successText = {
  color: '#047857',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '12px 0 0 0',
};

const hr = {
  borderColor: '#e9d5ec',
  margin: '24px 0',
};

const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
  margin: '16px 0',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'left' as const,
  margin: '16px 0',
};

const detailsBox = {
  backgroundColor: '#faf5fb',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '24px 0',
  border: '1px solid #e9d5ec',
};

const detailsHeading = {
  color: '#7d5580',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const detailsHr = {
  borderColor: '#e9d5ec',
  margin: '12px 0',
};

const detailsTable = {
  width: '100%',
};

const detailsLabel = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '6px 0',
  width: '40%',
};

const detailsValue = {
  color: '#374151',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '6px 0',
};

const button = {
  backgroundColor: '#7d5580',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 28px',
  margin: '28px 0',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
};
