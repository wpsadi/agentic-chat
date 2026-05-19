/**
 * Mail Job Types and Interfaces
 * All possible email jobs that can be queued through the mail service
 */

export type MailJobType =
  | "email-verification"
  | "password-reset"
  | "magic-link"
  | "2fa-setup"
  | "2fa-verification"
  | "org-invitation"
  | "security-alert"
  | "device-authorization";

export interface BaseMailJob {
  to: string;
  subject: string;
  jobType: MailJobType;
  createdAt: number;
  userId?: string;
}

export interface EmailVerificationJob extends BaseMailJob {
  jobType: "email-verification";
  data: {
    userName: string;
    verificationLink: string;
    verificationCode: string;
  };
}

export interface PasswordResetJob extends BaseMailJob {
  jobType: "password-reset";
  data: {
    userName: string;
    resetLink: string;
    resetCode: string;
    expiresIn: number; // minutes
  };
}

export interface MagicLinkJob extends BaseMailJob {
  jobType: "magic-link";
  data: {
    loginLink: string;
    loginCode: string;
    expiresIn: number; // minutes
  };
}

export interface TwoFASetupJob extends BaseMailJob {
  jobType: "2fa-setup";
  data: {
    userName: string;
    setupLink: string;
    backupCodes: string[];
  };
}

export interface TwoFAVerificationJob extends BaseMailJob {
  jobType: "2fa-verification";
  data: {
    userName: string;
    otpCode: string;
    expiresIn: number; // minutes
  };
}

export interface OrgInvitationJob extends BaseMailJob {
  jobType: "org-invitation";
  data: {
    invitedUserName: string;
    organizationName: string;
    inviterName: string;
    acceptLink: string;
    role: string;
  };
}

export interface SecurityAlertJob extends BaseMailJob {
  jobType: "security-alert";
  data: {
    userName: string;
    alertType:
    | "stale-user"
    | "new-device"
    | "password-changed"
    | "suspicious-activity"
    | "org-created"
    | "org-member-added"
    | "org-invitation-accepted"
    | "org-member-removed";
    message: string;
    actionLink?: string;
    actionText?: string;
  };
}

export interface DeviceAuthorizationJob extends BaseMailJob {
  jobType: "device-authorization";
  data: {
    deviceCode: string;
    deviceName: string;
    userCode: string;
    expiresIn: number; // minutes
    verificationLink: string;
  };
}

export type MailJob =
  | EmailVerificationJob
  | PasswordResetJob
  | MagicLinkJob
  | TwoFASetupJob
  | TwoFAVerificationJob
  | OrgInvitationJob
  | SecurityAlertJob
  | DeviceAuthorizationJob;

export interface MailJobResult {
  success: boolean;
  jobId: string;
  jobType: MailJobType;
  email: string;
  timestamp: number;
  error?: string;
}
