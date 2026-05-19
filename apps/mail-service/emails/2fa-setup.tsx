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

interface TwoFASetupProps {
  userName?: string;
  setupLink?: string;
  backupCodes?: string[];
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

export const TwoFASetupEmail = ({
  userName = "User",
  setupLink = `${baseUrl}/auth/2fa/setup`,
  backupCodes = ["BACKUP1", "BACKUP2", "BACKUP3"],
}: TwoFASetupProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Set up two-factor authentication</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Set up 2FA</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            You've started setting up two-factor authentication on your account.
            This adds an extra layer of security.
          </Text>

          <Section style={buttonSection}>
            <Button href={setupLink} style={button}>
              Complete Setup
            </Button>
          </Section>

          <Text style={text}>Your backup codes (keep these safe):</Text>

          <Section style={codesSection}>
            {backupCodes.map((code, index) => (
              <Text key={index} style={backupCode}>
                {code}
              </Text>
            ))}
          </Section>

          <Section style={warningSection}>
            <Text style={warningText}>
              Store your backup codes in a secure location. You can use them to
              regain access if you lose your authenticator device.
            </Text>
          </Section>

          <Text style={text}>
            If you didn't start this setup, please secure your account
            immediately.
          </Text>
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

TwoFASetupEmail.PreviewProps = {
  userName: "John Doe",
  setupLink: "https://agentic-chat.local/auth/2fa/setup",
  backupCodes: ["BACKUP-1A2B3C", "BACKUP-4D5E6F", "BACKUP-7G8H9I"],
} as TwoFASetupProps;

export default TwoFASetupEmail;

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

const codesSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "24px",
  fontFamily: "monospace",
};

const backupCode = {
  color: "#000000",
  fontSize: "12px",
  fontWeight: "600",
  margin: "8px 0",
  fontFamily: "monospace",
  letterSpacing: "1px",
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
