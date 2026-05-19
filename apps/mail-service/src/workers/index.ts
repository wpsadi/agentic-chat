/**
 * Mail Workers Index
 * Starts both mail workers
 */

import { startMailWorker1 } from "@/workers/worker-1";
import { startMailWorker2 } from "@/workers/worker-2";
import { verifyTransporter } from "@/mail/transporter";

/**
 * Start all mail workers
 */
export async function startAllWorkers(): Promise<any[]> {
  try {
    // Verify transporter connection first
    const isConnected = await verifyTransporter();
    if ( !isConnected ) {
      throw new Error( "Nodemailer transporter verification failed" );
    }

    // Start both workers
    const worker1 = await startMailWorker1();
    const worker2 = await startMailWorker2();

    console.log( "[Workers] Both mail workers started successfully" );

    return [worker1, worker2];
  } catch ( error ) {
    console.error( "[Workers] Failed to start workers:", error );
    throw error;
  }
}

// Handle graceful shutdown
process.on( "SIGTERM", async () => {
  console.log( "[Workers] SIGTERM received, shutting down gracefully..." );
  process.exit( 0 );
} );

process.on( "SIGINT", async () => {
  console.log( "[Workers] SIGINT received, shutting down gracefully..." );
  process.exit( 0 );
} );



export default startAllWorkers;
