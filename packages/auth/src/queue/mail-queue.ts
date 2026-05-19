import { Queue } from "bullmq";

// Configure Redis connection
const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt( process.env.REDIS_PORT || "6379", 10 ),
};

// Initialize the mail queue
export const mailQueue = new Queue( "mail", {
    connection: redisConnection,
} );
