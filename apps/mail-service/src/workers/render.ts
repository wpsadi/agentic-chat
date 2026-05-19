/**
 * Email Template Rendering
 * Converts React Email templates to HTML strings
 */

import type { MailJob } from "@/types/mail-job";
import EmailVerification from "@emails/email-verification";
import PasswordReset from "@emails/password-reset";
import MagicLink from "@emails/magic-link";
import TwoFASetup from "@emails/2fa-setup";
import TwoFAVerification from "@emails/2fa-verification";
import OrgInvitation from "@emails/org-invitation";
import SecurityAlert from "@emails/security-alert";
import DeviceAuthorization from "@emails/device-authorization";

/**
 * Convert JSX template to HTML string
 */
async function templateToHtml( template: any ): Promise<string> {
  // Use render function if available, or convert JSX to string
  try {
    // Dynamic import of @react-email/render if available
    const { render } = await import( "@react-email/render" );
    return await render( template );
  } catch ( _ ) {
    // Fallback: serialize to string
    return serializeTemplate( template );
  }
}

/**
 * Fallback template serialization
 */
function serializeTemplate( element: any ): string {
  if ( !element ) return "";

  if ( typeof element === "string" ) return element;

  if ( Array.isArray( element ) ) {
    return element.map( serializeTemplate ).join( "" );
  }

  if ( element.type ) {
    const tag = element.type;
    const props = element.props || {};
    const style = props.style ? serializeStyles( props.style ) : "";
    const attrs = Object.entries( props )
      .filter( ( [key] ) => !["children", "style"].includes( key ) )
      .map( ( [key, value] ) => `${key}="${value}"` )
      .join( " " );

    const children = props.children ? serializeTemplate( props.children ) : "";
    return `<${tag}${style}${attrs ? " " + attrs : ""}>${children}</${tag}>`;
  }

  return "";
}

/**
 * Serialize inline styles
 */
function serializeStyles( styles: Record<string, any> ): string {
  if ( !styles || typeof styles !== "object" ) return "";

  const cssStr = Object.entries( styles )
    .map( ( [key, value] ) => {
      const cssKey = key.replace( /([A-Z])/g, "-$1" ).toLowerCase();
      return `${cssKey}:${value}`;
    } )
    .join( ";" );

  return cssStr ? ` style="${cssStr}"` : "";
}

/**
 * Render email based on job type
 */
export async function renderEmail(
  job: MailJob,
): Promise<{ html: string; text: string }> {
  let template: any;

  switch ( job.jobType ) {
    case "email-verification": {
      const typedJob = job as any;
      template = EmailVerification( {
        userName: typedJob.data.userName,
        verificationLink: typedJob.data.verificationLink,
        verificationCode: typedJob.data.verificationCode,
      } );
      break;
    }

    case "password-reset": {
      const typedJob = job as any;
      template = PasswordReset( {
        userName: typedJob.data.userName,
        resetLink: typedJob.data.resetLink,
        resetCode: typedJob.data.resetCode,
        expiresIn: typedJob.data.expiresIn,
      } );
      break;
    }

    case "magic-link": {
      const typedJob = job as any;
      template = MagicLink( {
        loginLink: typedJob.data.loginLink,
        loginCode: typedJob.data.loginCode,
        expiresIn: typedJob.data.expiresIn,
      } );
      break;
    }

    case "2fa-setup": {
      const typedJob = job as any;
      template = TwoFASetup( {
        userName: typedJob.data.userName,
        setupLink: typedJob.data.setupLink,
        backupCodes: typedJob.data.backupCodes,
      } );
      break;
    }

    case "2fa-verification": {
      const typedJob = job as any;
      template = TwoFAVerification( {
        userName: typedJob.data.userName,
        otpCode: typedJob.data.otpCode,
        expiresIn: typedJob.data.expiresIn,
      } );
      break;
    }

    case "org-invitation": {
      const typedJob = job as any;
      template = OrgInvitation( {
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
      template = SecurityAlert( {
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
      template = DeviceAuthorization( {
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

  const html = await templateToHtml( template );
  const text = stripHtml( html );

  return { html, text };
}

/**
 * Strip HTML for plain text
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
