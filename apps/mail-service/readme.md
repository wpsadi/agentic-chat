# Mail Service

Queue-based email service using BullMQ, Redis, Nodemailer, and React Email with monochromatic Vercel-styled templates.

## Architecture

```
┌─────────────────────────────────────────┐
│  Better Auth (packages/auth)             │
│  Triggers mail events via hooks          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Mail Queue System (apps/mail-service)      │
├─────────────────────────────────────────────┤
│  ┌─ Redis Queue (localhost:6379)            │
│  ├─ Mail Job Producer (enqueue jobs)        │
│  ├─ Worker 1 (process verification mails)   │
│  ├─ Worker 2 (process 2FA, org, alerts)     │
│  ├─ Nodemailer Transport (SMTP/Gmail/SG)    │
│  ├─ React Email Templates (8 types)         │
│  └─ DLQ (permanent failures: forever)        │
└─────────────────────────────────────────────┘
```

## Features

- ✅ **Queue-based**: Asynchronous email processing via BullMQ + Redis
- ✅ **Dual Workers**: 2 concurrent workers for parallel processing
- ✅ **Retry Logic**: 3 automatic retries with exponential backoff
- ✅ **Dead Letter Queue**: Failed jobs stored forever for analysis
- ✅ **Monochromatic Templates**: 8 clean, grayscale Vercel-inspired email templates
- ✅ **React Email**: Type-safe email components
- ✅ **Flexible Transport**: SMTP, Gmail, SendGrid, or development console logging
- ✅ **Better Auth Integration**: Hooks into auth events for automatic emails

## Email Templates

All templates are monochromatic (white to black spectrum) and Vercel-inspired:

1. **Email Verification** - Verify email address with code
2. **Password Reset** - Reset password flow with link & code
3. **Magic Link Login** - Passwordless login authentication
4. **2FA Setup** - Enable two-factor authentication + backup codes
5. **2FA Verification** - OTP code for 2FA login (quick expiry)
6. **Organization Invitation** - Join organization invite
7. **Account Security Alert** - Account security notifications (stale user, new device, etc.)
8. **Device Authorization** - Confirm new device access request

## Quick Start

### 1. Install Dependencies

```bash
# From root
bun install

# Install mail-service deps
cd apps/mail-service
bun install
```

### 2. Configure Environment

```bash
# Copy example
cp .env.example .env.local

# For development (console logging):
MAIL_TRANSPORT=development
REDIS_HOST=localhost
REDIS_PORT=6379
APP_URL=http://localhost:3000
```

### 3. Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 redis:7

# Or if you have Redis installed locally
redis-server
```

### 4. Start Workers

```bash
# Terminal 1: Worker 1
npm run worker

# Terminal 2: Worker 2
npm run worker:2
```

### 5. Test the Queue

```bash
# Enqueue a test email
import { enqueueEmailVerification } from './src/mail/producer.js';

await enqueueEmailVerification({
  to: 'user@example.com',
  data: {
    userName: 'John Doe',
    verificationLink: 'http://localhost:3000/verify',
    verificationCode: 'ABC123',
  },
});
```

## Configuration

### Email Transport Options

**Development** (logs to console):

```bash
MAIL_TRANSPORT=development
```

**SMTP** (Gmail, custom servers):

```bash
MAIL_TRANSPORT=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=user@gmail.com
SMTP_PASSWORD=app-password
```

**Gmail** (direct):

```bash
MAIL_TRANSPORT=gmail
GMAIL_USER=user@gmail.com
GMAIL_PASSWORD=app-password
```

**SendGrid**:

```bash
MAIL_TRANSPORT=sendgrid
SENDGRID_API_KEY=your-key
```

See `.env.example` for all options.

## API / Producer Functions

### Enqueue Functions

```typescript
import {
  enqueueEmailVerification,
  enqueuePasswordReset,
  enqueueMagicLink,
  enqueueTwoFASetup,
  enqueueTwoFAVerification,
  enqueueOrgInvitation,
  enqueueSecurityAlert,
  enqueueDeviceAuthorization,
} from "./src/mail/producer.js";

// Example
await enqueueEmailVerification({
  to: "user@example.com",
  data: {
    userName: "John",
    verificationLink: "http://localhost:3000/verify?code=abc123",
    verificationCode: "ABC123",
  },
  userId: "user-id-123", // optional
});
```

### Queue Statistics

```typescript
import { getQueueStats } from "./src/queue/config.js";

const stats = await getQueueStats();
// {
//   queueCounts: { waiting: 5, active: 2, completed: 100, failed: 3, ... },
//   dlqCounts: { total: 2 }
// }
```

### Inspect DLQ (Dead Letter Queue)

```typescript
import { mailDLQ } from "./src/queue/config.js";

const dlqJobs = await mailDLQ.getJobs();
console.log(dlqJobs); // Failed jobs stored forever
```

## Integration with Better Auth

The mail service integrates with Better Auth via a plugin system. In your auth configuration:

```typescript
import { auth } from "@repo/auth";
import { mailPlugin } from "@repo/auth/plugins/mail-plugin";

export const auth = betterAuth({
  // ... other config
  plugins: [
    // ... other plugins
    mailPlugin(), // Hooks into auth events
  ],
});
```

The plugin automatically queues emails for:

- Sign-up (email verification)
- Password reset requests
- Magic link logins
- 2FA setup & verification
- Organization invitations
- Device authorization
- Security alerts

## Workers

### Worker 1 (`npm run worker`)

Processes:

- Email verification
- Password reset
- Magic link emails

### Worker 2 (`npm run worker:2`)

Processes:

- 2FA setup/verification
- Organization invitations
- Security alerts
- Device authorization

**Both workers:**

- Concurrency: 1 job at a time
- Retries: 3 attempts with exponential backoff (2s, 4s, 8s)
- On permanent failure: Move to DLQ (stored forever)

## Email Preview

For local development, use React Email's preview:

```bash
npm run dev:email
```

Open [localhost:3000](http://localhost:3000) to preview all email templates.

## File Structure

```
apps/mail-service/
├── src/
│   ├── types/
│   │   └── mail-job.ts          # Job type definitions
│   ├── queue/
│   │   └── config.ts            # BullMQ + Redis setup, DLQ
│   ├── mail/
│   │   ├── transporter.ts       # Nodemailer configuration
│   │   ├── producer.ts          # Enqueue functions
│   │   └── renderer.ts          # Template rendering (legacy)
│   └── workers/
│       ├── worker-1.ts          # Process group 1 jobs
│       ├── worker-2.ts          # Process group 2 jobs
│       ├── render.ts            # Email template rendering
│       └── index.ts             # Start all workers
├── emails/
│   ├── email-verification.tsx
│   ├── password-reset.tsx
│   ├── magic-link.tsx
│   ├── 2fa-setup.tsx
│   ├── 2fa-verification.tsx
│   ├── org-invitation.tsx
│   ├── security-alert.tsx
│   └── device-authorization.tsx
├── .env.example                 # Environment variables guide
└── package.json
```

## Development Tips

### Test Email in Development

```bash
# Set transport to development
MAIL_TRANSPORT=development

# Enqueue an email - it will be logged to console instead of sent
npm run worker
```

### Monitor Queue

```typescript
// Add this in a route handler or script
import { getQueueStats, mailQueue, mailDLQ } from "./src/queue/config.js";

const stats = await getQueueStats();
console.log("Queue Stats:", stats);

// Check specific jobs
const failedJobs = await mailQueue.getJobs(["failed"]);
const dlqJobs = await mailDLQ.getJobs();
```

### Retry Failed Jobs

```typescript
import { mailQueue } from "./src/queue/config.js";

const failedJobs = await mailQueue.getJobs(["failed"]);
for (const job of failedJobs) {
  await job.retry(); // Retry the job
}
```

### Troubleshooting

**Connection refused on localhost:6379:**

- Ensure Redis is running: `redis-server` or `docker run -p 6379:6379 redis:7`

**Emails not sending:**

- Check `MAIL_TRANSPORT` is correctly set
- Verify SMTP credentials in `.env`
- Check logs for errors: `npm run worker 2>&1 | grep -i error`

**Jobs stuck in queue:**

- Workers might be down. Restart: `npm run worker`
- Check worker logs for errors

## Production Deployment

### Recommendations

1. **Redis**: Use managed service (AWS ElastiCache, Redis Cloud, etc.)
2. **Email Provider**: Use SendGrid, AWS SES, or similar for reliability
3. **Monitoring**: Set up monitoring for queue depth and worker health
4. **DLQ Review**: Periodically review DLQ jobs to fix issues
5. **Workers**: Run workers as separate services/containers
6. **Scaling**: Increase worker concurrency or add more worker instances as needed

### Example Production Config

```bash
# .env.production
REDIS_HOST=redis-cluster.production.aws.amazonaws.com
REDIS_PORT=6379

MAIL_TRANSPORT=sendgrid
SENDGRID_API_KEY=SG.xxxxx
MAIL_FROM=noreply@yourdomain.com

APP_URL=https://yourdomain.com
NODE_ENV=production
LOG_LEVEL=warn
```

## License

MIT
