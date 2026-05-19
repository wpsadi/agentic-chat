import { startAllWorkers } from "./workers";

startAllWorkers().catch( ( error ) => {
  console.error( "[Main] Failed to start mail workers:", error );
  process.exit( 1 );
} );