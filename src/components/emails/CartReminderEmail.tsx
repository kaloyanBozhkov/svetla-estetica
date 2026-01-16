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
  Row,
  Column,
} from "@react-email/components";
import { BASE_URL } from "@/lib/constants";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartReminderEmailProps {
  userName?: string;
  items: CartItem[];
  total: number;
  customMessage: string;
}

export default function CartReminderEmail({
  userName,
  items,
  total,
  customMessage,
}: CartReminderEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100);
  };

  return (
    <Html>
      <Head />
      <Preview>Il tuo carrello ti aspetta - Svetla Estetica</Preview>
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
            <Text style={paragraph}>
              Ciao{userName ? ` ${userName}` : ""}!
            </Text>
            
            <Text style={paragraph}>{customMessage}</Text>

            <Hr style={hr} />
            
            <Text style={sectionTitle}>I tuoi prodotti:</Text>
            
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemImageCol}>
                  {item.imageUrl ? (
                    <Img
                      src={item.imageUrl}
                      width="60"
                      height="60"
                      alt={item.name}
                      style={itemImage}
                    />
                  ) : (
                    <div style={itemImagePlaceholder} />
                  )}
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemQty}>Quantità: {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />
            
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Totale carrello:</Text>
              </Column>
              <Column>
                <Text style={totalPrice}>{formatPrice(total)}</Text>
              </Column>
            </Row>

            <Button style={button} href={`${BASE_URL}/carrello`}>
              Completa il tuo ordine
            </Button>

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

const sectionTitle = {
  color: "#7d5580",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "16px 0",
};

const itemRow = {
  marginBottom: "16px",
};

const itemImageCol = {
  width: "70px",
  verticalAlign: "top" as const,
};

const itemImage = {
  borderRadius: "8px",
  backgroundColor: "#f5f0f6",
  objectFit: "contain" as const,
};

const itemImagePlaceholder = {
  width: "60px",
  height: "60px",
  borderRadius: "8px",
  backgroundColor: "#f5f0f6",
};

const itemDetailsCol = {
  verticalAlign: "middle" as const,
  paddingLeft: "12px",
};

const itemName = {
  color: "#4a4a4a",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const itemQty = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0",
};

const itemPriceCol = {
  width: "100px",
  verticalAlign: "middle" as const,
  textAlign: "right" as const,
};

const itemPrice = {
  color: "#7d5580",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const totalRow = {
  marginTop: "16px",
};

const totalLabel = {
  color: "#4a4a4a",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const totalPrice = {
  color: "#7d5580",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "right" as const,
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

