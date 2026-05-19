import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

interface TwoFAVerificationProps {
  userName?: string;
  otpCode?: string;
  expiresIn?: number;
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

export const TwoFAVerificationEmail = ({
  userName = "User",
  otpCode = "123456",
  expiresIn = 5,
}: TwoFAVerificationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Your 2FA verification code</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Verification code</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            Use this code to verify your login. Do not share this code with
            anyone.
          </Text>

          <Section style={codeSection}>
            <Text style={code}>{otpCode}</Text>
          </Section>

          <Text style={smallText}>
            This code expires in {expiresIn} minutes.
          </Text>

          <Section style={warningSection}>
            <Text style={warningText}>
              If you didn't try to log in, please ignore this email and secure
              your account.
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

TwoFAVerificationEmail.PreviewProps = {
  userName: "John Doe",
  otpCode: "123456",
  expiresIn: 5,
} as TwoFAVerificationProps;

export default TwoFAVerificationEmail;

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

const codeSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "24px 16px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const code = {
  color: "#000000",
  fontSize: "32px",
  fontWeight: "700",
  fontFamily: "monospace",
  letterSpacing: "4px",
  margin: "0",
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
