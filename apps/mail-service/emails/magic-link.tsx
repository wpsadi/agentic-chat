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

interface MagicLinkProps {
  loginLink?: string;
  loginCode?: string;
  expiresIn?: number;
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

export const MagicLinkEmail = ({
  loginLink = `${baseUrl}/auth/magic-link`,
  loginCode = "MAGIC123456",
  expiresIn = 15,
}: MagicLinkProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Your magic login link</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Your login link</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>
            Click the button below to sign in to your account. No password
            needed.
          </Text>

          <Section style={buttonSection}>
            <Button href={loginLink} style={button}>
              Sign In
            </Button>
          </Section>

          <Text style={text}>Or use this code:</Text>

          <Section style={codeSection}>
            <Text style={code}>{loginCode}</Text>
          </Section>

          <Text style={smallText}>
            This link expires in {expiresIn} minutes. Only use links from
            trusted emails.
          </Text>

          <Section style={warningSection}>
            <Text style={warningText}>
              If you didn't request this login link, you can safely ignore this
              email.
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

MagicLinkEmail.PreviewProps = {
  loginLink: "https://agentic-chat.local/auth/magic-link?code=abc123",
  loginCode: "MAGIC123456",
  expiresIn: 15,
} as MagicLinkProps;

export default MagicLinkEmail;

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

const codeSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const code = {
  color: "#000000",
  fontSize: "24px",
  fontWeight: "600",
  fontFamily: "monospace",
  letterSpacing: "2px",
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
