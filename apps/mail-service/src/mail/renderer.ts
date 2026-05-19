/**
 * Email Template Renderer
 * Renders React Email components to HTML
 */

import { render } from "@react-email/render";
import { JSX } from "react";
import EmailVerificationEmail from "@emails/email-verification";
import PasswordResetEmail from "@emails/password-reset";
import MagicLinkEmail from "@emails/magic-link";
import TwoFASetupEmail from "@emails/2fa-setup";
import TwoFAVerificationEmail from "@emails/2fa-verification";
import OrgInvitationEmail from "@emails/org-invitation";
import SecurityAlertEmail from "@emails/security-alert";
import DeviceAuthorizationEmail from "@emails/device-authorization";
import type { MailJob } from "@/types/mail-job";

/**
 * Render email template to HTML based on job type
 */
export async function renderEmailTemplate( job: MailJob ): Promise<string> {
  let template: JSX.Element;

  switch ( job.jobType ) {
    case "email-verification": {
      const typedJob = job as any;
      template = EmailVerificationEmail( {
        userName: typedJob.data.userName,
        verificationLink: typedJob.data.verificationLink,
        verificationCode: typedJob.data.verificationCode,
      } );
      break;
    }

    case "password-reset": {
      const typedJob = job as any;
      template = PasswordResetEmail( {
        userName: typedJob.data.userName,
        resetLink: typedJob.data.resetLink,
        resetCode: typedJob.data.resetCode,
        expiresIn: typedJob.data.expiresIn,
      } );
      break;
    }

    case "magic-link": {
      const typedJob = job as any;
      template = MagicLinkEmail( {
        loginLink: typedJob.data.loginLink,
        loginCode: typedJob.data.loginCode,
        expiresIn: typedJob.data.expiresIn,
      } );
      break;
    }

    case "2fa-setup": {
      const typedJob = job as any;
      template = TwoFASetupEmail( {
        userName: typedJob.data.userName,
        setupLink: typedJob.data.setupLink,
        backupCodes: typedJob.data.backupCodes,
      } );
      break;
    }

    case "2fa-verification": {
      const typedJob = job as any;
      template = TwoFAVerificationEmail( {
        userName: typedJob.data.userName,
        otpCode: typedJob.data.otpCode,
        expiresIn: typedJob.data.expiresIn,
      } );
      break;
    }

    case "org-invitation": {
      const typedJob = job as any;
      template = OrgInvitationEmail( {
        invitedUserName: typedJob.data.invitedUserName,
        organizationName: typedJob.data.organizationName,
        inviterName: typedJob.data.inviterName,
        acceptLink: typedJob.data.acceptLink,
        role: typedJob.data.role,
      } );
      break;
    }

    case "security-alert": {
      const typedJob = job as any;
      template = SecurityAlertEmail( {
        userName: typedJob.data.userName,
        alertType: typedJob.data.alertType,
        message: typedJob.data.message,
        actionLink: typedJob.data.actionLink,
        actionText: typedJob.data.actionText,
      } );
      break;
    }

    case "device-authorization": {
      const typedJob = job as any;
      template = DeviceAuthorizationEmail( {
        deviceCode: typedJob.data.deviceCode,
        deviceName: typedJob.data.deviceName,
        userCode: typedJob.data.userCode,
        expiresIn: typedJob.data.expiresIn,
        verificationLink: typedJob.data.verificationLink,
      } );
      break;
    }

    default:
      throw new Error( `Unknown email type: ${( job as any ).jobType}` );
  }

  try {
    const html = await render( template );
    return html;
  } catch ( error ) {
    console.error(
      `[Renderer] Failed to render template for ${job.jobType}:`,
      error,
    );
    throw error;
  }
}

/**
 * Render email with plain text fallback
 */
export async function renderEmailWithText(
  job: MailJob,
): Promise<{ html: string; text: string }> {
  const html = await renderEmailTemplate( job );
  const text = stripHtml( html );

  return {
    html,
    text,
  };
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml( html: string ): string {
  return html
    .replace( /<[^>]*>/g, "" )
    .replace( /&nbsp;/g, " " )
    .replace( /&lt;/g, "<" )
    .replace( /&gt;/g, ">" )
    .replace( /&amp;/g, "&" )
    .trim();
}
