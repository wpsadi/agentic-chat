/**
 * BullMQ Queue Configuration
 * Redis connection: localhost:6379
 * Queue name: mail
 */

import { Queue, Worker, QueueEvents } from "bullmq";
import { Redis } from "ioredis";
import type { MailJob } from "@/types/mail-job";

// Redis connection for queue
export const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt( process.env.REDIS_PORT || "6379", 10 ),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Main mail queue
export const mailQueue = new Queue<MailJob>( "mail", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
    },
    removeOnFail: false, // Keep failed jobs for debugging
  },
} );

// Dead Letter Queue (DLQ) for permanently failed jobs
export const mailDLQ = new Queue<MailJob>( "mail-dlq", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: false, // Keep all DLQ jobs forever
  },
} );

// Queue events for monitoring
export const mailQueueEvents = new QueueEvents( "mail", {
  connection: redisConnection,
} );

/**
 * Create a worker for processing mail jobs
 * @param workerId - Unique identifier for this worker
 * @param processor - Function to process jobs
 */
export function createMailWorker<T extends MailJob>(
  workerId: string,
  processor: ( job: any ) => Promise<any>,
  concurrency: number = 1,
) {
  return new Worker<T>( "mail", processor, {
    connection: redisConnection,
    concurrency,
    settings: {
    },
  } );
}

/**
 * Move a job to DLQ when it fails permanently
 */
export async function moveToDLQ( job: any, reason: string ): Promise<void> {
  try {
    const dlqData = {
      ...job.data,
      failedAt: new Date(),
      originalJobId: job.id,
      failureReason: reason,
      attempts: job.attemptsMade,
    };

    await mailDLQ.add( `${job.name}-${job.id}`, dlqData, {
      jobId: `dlq-${job.id}`,
    } );
    console.log( `[DLQ] Job ${job.id} moved to dead letter queue: ${reason}` );
  } catch ( error ) {
    console.error( `[DLQ] Failed to move job to DLQ:`, error );
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  const stats = {
    queueMetrics: await mailQueue.getMetrics( "completed" ),
    queueCounts: {
      waiting: await mailQueue.getWaitingCount(),
      active: await mailQueue.getActiveCount(),
      completed: await mailQueue.getCompletedCount(),
      failed: await mailQueue.getFailedCount(),
      delayed: await mailQueue.getDelayedCount(),
    },
    dlqCounts: {
      total: await mailDLQ.count(),
    },
  };
  return stats;
}

/**
 * Clean up old jobs
 */
export async function cleanupOldJobs( maxAgeMs: number = 3600000 ) {
  try {
    await mailQueue.clean( maxAgeMs, 10000, "completed" );
    console.log( "[Queue] Cleaned up old completed jobs" );
  } catch ( error ) {
    console.error( "[Queue] Cleanup error:", error );
  }
}
