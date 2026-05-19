/**
 * Nodemailer Configuration
 * Supports multiple transports: SMTP, Gmail, SendGrid, etc.
 * Configure via environment variables
 */

import nodemailer from "nodemailer";

type TransportConfig = {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user?: string;
    pass?: string;
  };
  from?: string;
};

/**
 * Create and validate nodemailer transporter
 */
export function createTransporter() {

  const config: TransportConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt( process.env.SMTP_PORT || "587", 10 ),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport( config );


  return transporter;
}

export const transporter = createTransporter();

/**
 * Email sending options interface
 */
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Send email
 */
export async function sendEmail( options: SendEmailOptions ) {
  try {
    const mailOptions = {
      from:
        options.from || process.env.MAIL_FROM || "noreply@agentic-chat.local",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    };

    const info = await transporter.sendMail( mailOptions );

    console.log(
      `[Mail] Email sent successfully to ${options.to}:`,
      info.messageId,
    );

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch ( error ) {
    console.error( `[Mail] Failed to send email to ${options.to}:`, error );
    throw error;
  }
}

/**
 * Verify transporter connection
 */
export async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log( "[Mail] Transporter verified successfully" );
    return true;
  } catch ( error ) {
    console.error( "[Mail] Transporter verification failed:", error );
    return false;
  }
}
