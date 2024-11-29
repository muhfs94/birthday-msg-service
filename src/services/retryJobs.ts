import { prisma } from '../utils/prismaClient';
import { sendBirthdayMessages } from './messageService';

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 30_000;

export async function retryPendingJobs() {
  const pendingJobs = await prisma.retryJob.findMany({
    where: {
      status: 'pending',
    },
  });

  for (const job of pendingJobs) {
    // Exceed the retries, mark it as failed
    if (job.retryCount >= MAX_RETRIES) {
      await prisma.retryJob.update({
        where: {
          id: job.id,
        },
        data: { status: 'failed' },
      });
      continue;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: job.userId,
      },
    });
    if (!user) {
      console.error(`User with id ${job.userId} not found`);
      continue;
    }

    try {
      await sendBirthdayMessages(user, true);
      await prisma.retryJob.update({
        where: {
          id: job.id,
        },
        data: { status: 'success', retryCount: job.retryCount + 1 },
      });
    } catch (error) {
      console.error(
        `Retry job failed for user with id ${job.userId}: ${error}. Retrying in ${RETRY_INTERVAL / 1000} seconds...`
      );
      await prisma.retryJob.update({
        where: {
          id: job.id,
        },
        data: { retryCount: job.retryCount + 1, lastAttempt: new Date() },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }
}
