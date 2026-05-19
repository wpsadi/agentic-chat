/**
 * Mail Queue Worker
 * Processes mail jobs and sends emails via Nodemailer
 * Worker 1 - Handles verification, password, and magic-link emails
 */

import { createMailWorker, moveToDLQ } from "@/queue/config";
import { sendEmail } from "@/mail/transporter";
import { renderEmail } from "@/workers/render";
import type { MailJob } from "@/types/mail-job";

const WORKER_ID = "mail-worker-1";
const WORKER_CONCURRENCY = 1;

/**
 * Process mail job
 */
async function processMailJob( job: any ): Promise<any> {
  const mailJob = job.data as MailJob;

  try {
    console.log(
      `[${WORKER_ID}] Processing job: ${job.id} (${mailJob.jobType})`,
    );

    // Render email template
    const { html, text } = await renderEmail( mailJob );

    // Send email
    const result = await sendEmail( {
      to: mailJob.to,
      subject: mailJob.subject,
      html,
      text,
    } );

    console.log( `[${WORKER_ID}] Email sent successfully for job ${job.id}` );

    return {
      success: true,
      jobId: job.id,
      messageId: result.messageId,
      email: mailJob.to,
    };
  } catch ( error ) {
    const errorMessage = error instanceof Error ? error.message : String( error );
    console.error( `[${WORKER_ID}] Job failed: ${job.id} - ${errorMessage}` );
    console.error( `[${WORKER_ID}] Error details:`, error );

    // Check if this is a permanent failure (after retries exhausted)
    if ( job.attemptsMade >= ( job.opts.attempts || 3 ) ) {
      await moveToDLQ(
        job,
        `Permanent failure after ${job.attemptsMade} attempts: ${errorMessage}`,
      );
    }

    throw error;
  }
}

/**
 * Start worker 1
 */
export async function startMailWorker1(): Promise<any> {
  const worker = createMailWorker<MailJob>(
    WORKER_ID,
    processMailJob,
    WORKER_CONCURRENCY,
  );

  worker.on( "completed", ( job: any ) => {
    console.log( `[${WORKER_ID}] Job completed: ${job.id}` );
  } );

  worker.on( "failed", ( job: any, err: Error ) => {
    console.error( `[${WORKER_ID}] Job failed: ${job?.id} - ${err.message}` );
  } );

  worker.on( "error", ( err: Error ) => {
    console.error( `[${WORKER_ID}] Worker error:`, err );
  } );

  console.log( `[${WORKER_ID}] Started and listening for mail jobs...` );
  return worker;
}

export default startMailWorker1;
