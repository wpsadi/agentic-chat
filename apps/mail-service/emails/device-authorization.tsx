import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

interface DeviceAuthorizationProps {
  deviceCode?: string;
  deviceName?: string;
  userCode?: string;
  expiresIn?: number;
  verificationLink?: string;
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

export const DeviceAuthorizationEmail = ({
  deviceCode = "ABCD-1234",
  deviceName = "Desktop",
  userCode = "USER-1234-5678",
  expiresIn = 10,
  verificationLink = `${baseUrl}/auth/device-verify`,
}: DeviceAuthorizationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Authorize a new device</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Authorize device</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>
            A new device is trying to access your account.
          </Text>

          <Section style={deviceSection}>
            <Text style={deviceLabel}>Device</Text>
            <Text style={deviceValue}>{deviceName}</Text>

            <Text style={deviceLabel}>Device Code</Text>
            <Text style={deviceCodeStyle}>{deviceCode}</Text>
          </Section>

          <Section style={buttonSection}>
            <Button href={verificationLink} style={button}>
              Authorize Device
            </Button>
          </Section>

          <Text style={text}>Or confirm using your user code:</Text>

          <Section style={codeSection}>
            <Text style={code}>{userCode}</Text>
          </Section>

          <Text style={smallText}>
            This authorization request expires in {expiresIn} minutes.
          </Text>

          <Section style={warningSection}>
            <Text style={warningText}>
              If you didn't attempt to access your account from a new device, do
              not authorize and contact support immediately.
            </Text>
          </Section>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            © 2024 Agentic Chat. All rights reserved.
          </Text>
          <Text style={footerLink}>
            <Link href={baseUrl} style={link}>
              Visit our website
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

DeviceAuthorizationEmail.PreviewProps = {
  deviceCode: "ABCD-1234",
  deviceName: "iPhone 15 Pro",
  userCode: "USER-1234-5678",
  expiresIn: 10,
  verificationLink: "https://agentic-chat.local/auth/device-verify?code=abc123",
} as DeviceAuthorizationProps;

export default DeviceAuthorizationEmail;

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: "580px",
  margin: "0 auto",
  padding: "20px 0",
};

const header = {
  borderBottom: "1px solid #f5f5f5",
  paddingBottom: "24px",
  marginBottom: "24px",
};

const h1 = {
  color: "#000000",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0",
  marginBottom: "12px",
};

const content = {
  paddingBottom: "24px",
};

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "12px 0",
};

const smallText = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const buttonSection = {
  paddingBottom: "24px",
  paddingTop: "24px",
};

const button = {
  backgroundColor: "#000000",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "1.3",
  padding: "12px 24px",
  borderRadius: "4px",
  textDecoration: "none",
  display: "inline-block",
};

const deviceSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "20px",
  marginBottom: "24px",
};

const deviceLabel = {
  color: "#999999",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 6px 0",
};

const deviceValue = {
  color: "#000000",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const deviceCodeStyle = {
  color: "#000000",
  fontSize: "16px",
  fontWeight: "700",
  fontFamily: "monospace",
  letterSpacing: "2px",
  margin: "0",
};

const codeSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "20px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const code = {
  color: "#000000",
  fontSize: "20px",
  fontWeight: "700",
  fontFamily: "monospace",
  letterSpacing: "3px",
};

const warningSection = {
  backgroundColor: "#f5f5f5",
  borderLeft: "4px solid #999999",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "24px",
};

const warningText = {
  color: "#333333",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};

const link = {
  color: "#000000",
  textDecoration: "underline",
};

const footer = {
  borderTop: "1px solid #f5f5f5",
  paddingTop: "24px",
  marginTop: "24px",
};

const footerText = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
};

const footerLink = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};
