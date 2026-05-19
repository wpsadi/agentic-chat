/**
 * Mail Job Producer
 * Enqueues mail jobs for processing
 */

import { mailQueue } from "@/queue/config";
import type {
  MailJob,
  EmailVerificationJob,
  PasswordResetJob,
  MagicLinkJob,
  TwoFASetupJob,
  TwoFAVerificationJob,
  OrgInvitationJob,
  SecurityAlertJob,
  DeviceAuthorizationJob,
} from "@/types/mail-job";

/**
 * Add email verification job to queue
 */
export async function enqueueEmailVerification(
  data: Omit<EmailVerificationJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "email-verification",
    {
      ...data,
      jobType: "email-verification",
      subject: "Verify your email address",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] Email verification job enqueued: ${job.id}` );
  return job;
}

/**
 * Add password reset job to queue
 */
export async function enqueuePasswordReset(
  data: Omit<PasswordResetJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "password-reset",
    {
      ...data,
      jobType: "password-reset",
      subject: "Reset your password",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] Password reset job enqueued: ${job.id}` );
  return job;
}

/**
 * Add magic link login job to queue
 */
export async function enqueueMagicLink(
  data: Omit<MagicLinkJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "magic-link",
    {
      ...data,
      jobType: "magic-link",
      subject: "Your login link",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] Magic link job enqueued: ${job.id}` );
  return job;
}

/**
 * Add 2FA setup job to queue
 */
export async function enqueueTwoFASetup(
  data: Omit<TwoFASetupJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "2fa-setup",
    {
      ...data,
      jobType: "2fa-setup",
      subject: "Set up two-factor authentication",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] 2FA setup job enqueued: ${job.id}` );
  return job;
}

/**
 * Add 2FA verification job to queue
 */
export async function enqueueTwoFAVerification(
  data: Omit<TwoFAVerificationJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "2fa-verification",
    {
      ...data,
      jobType: "2fa-verification",
      subject: "Your 2FA verification code",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] 2FA verification job enqueued: ${job.id}` );
  return job;
}

/**
 * Add organization invitation job to queue
 */
export async function enqueueOrgInvitation(
  data: Omit<OrgInvitationJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "org-invitation",
    {
      ...data,
      jobType: "org-invitation",
      subject: `You're invited to join ${data.data.organizationName}`,
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] Organization invitation job enqueued: ${job.id}` );
  return job;
}

/**
 * Add security alert job to queue
 */
export async function enqueueSecurityAlert(
  data: Omit<SecurityAlertJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "security-alert",
    {
      ...data,
      jobType: "security-alert",
      subject: "Security Alert",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] Security alert job enqueued: ${job.id}` );
  return job;
}

/**
 * Add device authorization job to queue
 */
export async function enqueueDeviceAuthorization(
  data: Omit<DeviceAuthorizationJob, "jobType" | "createdAt" | "subject">,
) {
  const job = await mailQueue.add(
    "device-authorization",
    {
      ...data,
      jobType: "device-authorization",
      subject: "Authorize a new device",
      createdAt: Date.now(),
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 3600 },
    },
  );
  console.log( `[Producer] Device authorization job enqueued: ${job.id}` );
  return job;
}

/**
 * Generic job enqueuer for any mail job type
 */
export async function enqueueMailJob<T extends MailJob>( jobData: T ) {
  const job = await mailQueue.add( jobData.jobType, jobData, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { age: 3600 },
  } );
  console.log( `[Producer] ${jobData.jobType} job enqueued: ${job.id}` );
  return job;
}
