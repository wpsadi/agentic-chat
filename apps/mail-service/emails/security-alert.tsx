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

interface SecurityAlertProps {
  userName?: string;
  alertType?:
    | "stale-user"
    | "new-device"
    | "password-changed"
    | "suspicious-activity"
    | "org-created"
    | "org-member-added"
    | "org-invitation-accepted"
    | "org-member-removed";
  message?: string;
  actionLink?: string;
  actionText?: string;
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

const getAlertTitle = (type: string): string => {
  switch (type) {
    case "stale-user":
      return "Account activity notice";
    case "new-device":
      return "New device detected";
    case "password-changed":
      return "Password changed";
    case "org-created":
      return "Organization created";
    case "org-member-added":
      return "Added to organization";
    case "org-invitation-accepted":
      return "Invitation accepted";
    case "org-member-removed":
      return "Removed from organization";
    case "suspicious-activity":
      return "Suspicious activity detected";
    default:
      return "Security alert";
  }
};

export const SecurityAlertEmail = ({
  userName = "User",
  alertType = "suspicious-activity",
  message = "We detected unusual activity on your account.",
  actionLink = `${baseUrl}/account/security`,
  actionText = "Review activity",
}: SecurityAlertProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>{getAlertTitle(alertType)}</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{getAlertTitle(alertType)}</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>{message}</Text>

          {actionLink && actionText && (
            <Section style={buttonSection}>
              <Button href={actionLink} style={button}>
                {actionText}
              </Button>
            </Section>
          )}

          <Section style={alertSection}>
            <Text style={alertLabel}>What you should do:</Text>
            <Text style={alertItem}>• Review your recent account activity</Text>
            <Text style={alertItem}>• Check for any unauthorized changes</Text>
            <Text style={alertItem}>• Update your password if necessary</Text>
            <Text style={alertItem}>
              • Enable two-factor authentication for added security
            </Text>
          </Section>

          <Text style={text}>
            If you don't recognize this activity or believe your account is
            compromised, please take immediate action to secure it.
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

SecurityAlertEmail.PreviewProps = {
  userName: "John Doe",
  alertType: "suspicious-activity",
  message: "We detected a login attempt from a new location: New York, USA",
  actionLink: "https://agentic-chat.local/account/security",
  actionText: "Review activity",
} as SecurityAlertProps;

export default SecurityAlertEmail;

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
  borderBottom: "2px solid #333333",
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

const alertSection = {
  backgroundColor: "#f5f5f5",
  borderLeft: "4px solid #333333",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "24px",
};

const alertLabel = {
  color: "#000000",
  fontSize: "13px",
  fontWeight: "700",
  margin: "0 0 12px 0",
};

const alertItem = {
  color: "#333333",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "6px 0",
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
