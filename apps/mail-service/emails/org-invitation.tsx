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

interface OrgInvitationProps {
  invitedUserName?: string;
  organizationName?: string;
  inviterName?: string;
  acceptLink?: string;
  role?: string;
}

const baseUrl = Bun.env.APP_URLL
  ? `https://${Bun.env.APP_URLL}`
  : "http://localhost:3000";

export const OrgInvitationEmail = ({
  invitedUserName = "User",
  organizationName = "Acme Corp",
  inviterName = "John Doe",
  acceptLink = `${baseUrl}/org/join`,
  role = "Member",
}: OrgInvitationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Join {organizationName} on Agentic Chat</Preview>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>You're invited</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello {invitedUserName},</Text>
          <Text style={text}>
            <strong>{inviterName}</strong> has invited you to join{" "}
            <strong>{organizationName}</strong> as a <strong>{role}</strong>.
          </Text>

          <Section style={buttonSection}>
            <Button href={acceptLink} style={button}>
              Accept Invitation
            </Button>
          </Section>

          <Section style={infoSection}>
            <Text style={infoLabel}>Organization</Text>
            <Text style={infoValue}>{organizationName}</Text>

            <Text style={infoLabel}>Invited by</Text>
            <Text style={infoValue}>{inviterName}</Text>

            <Text style={infoLabel}>Role</Text>
            <Text style={infoValue}>{role}</Text>
          </Section>

          <Text style={smallText}>This invitation will expire in 7 days.</Text>

          <Text style={text}>
            If you don't recognize this organization or didn't expect this
            invitation, you can safely ignore this email.
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

OrgInvitationEmail.PreviewProps = {
  invitedUserName: "Jane Smith",
  organizationName: "Acme Corporation",
  inviterName: "John Doe",
  acceptLink: "https://agentic-chat.local/org/join?token=xyz123",
  role: "Developer",
} as OrgInvitationProps;

export default OrgInvitationEmail;

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

const infoSection = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "20px",
  marginBottom: "24px",
};

const infoLabel = {
  color: "#999999",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px 0",
};

const infoValue = {
  color: "#000000",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 16px 0",
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
