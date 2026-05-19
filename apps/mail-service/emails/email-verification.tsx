import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

interface EmailVerificationProps {
  userName?: string;
  verificationLink?: string;
  verificationCode?: string;
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

export const EmailVerificationEmail = ({
  userName = "User",
  verificationLink = `${baseUrl}/verify`,
  verificationCode = "123456",
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Verify your email address</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Verify your email</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            Thank you for signing up. Please verify your email address to
            activate your account.
          </Text>

          <Section style={buttonSection}>
            <Button href={verificationLink} style={button}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={text}>Or enter this verification code:</Text>

          <Section style={codeSection}>
            <Text style={code}>{verificationCode}</Text>
          </Section>

          <Text style={smallText}>
            This verification link expires in 24 hours.
          </Text>

          <Text style={text}>
            If you didn't sign up for this account, you can safely ignore this
            email.
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

EmailVerificationEmail.PreviewProps = {
  userName: "John Doe",
  verificationLink: "https://agentic-chat.local/verify?code=abc123",
  verificationCode: "123456",
} as EmailVerificationProps;

export default EmailVerificationEmail;

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
