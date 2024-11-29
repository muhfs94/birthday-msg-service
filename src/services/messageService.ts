import axios from 'axios';
import axiosRetry, { AxiosRetry } from 'axios-retry';
import { prisma } from '../utils/prismaClient';
import { User } from '@prisma/client';

const FIVE_SECONDS = 5_000;

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * FIVE_SECONDS,
});

const MESSAGE_API_ENDPOINT =
  'https://email-service.digitalenvision.com.au/send-email';

export const sendMessage = async (user: User, message: string) => {
  const payload = {
    email: user.email,
    message,
  };

  try {
    await axios.post(MESSAGE_API_ENDPOINT, payload);
  } catch (error) {
    console.error(error);
  }
};

export const sendBirthdayMessages = async (
  user: User,
  fromRetryJob: boolean
) => {
  try {
    console.log('-----------------------------------------------')
    console.log(`will send birthday message to ${user.email}`);
    const birthdayMessage = `Hey, ${user.firstName} ${user.lastName}, it’s your birthday`;
    await sendMessage(user, birthdayMessage);
    console.log(`>>>>>>>>>>>>>>>>>SUCCESS SENT Birthday email successfully sent to ${user.email}} at ${new Date()}`);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastBirthdaySent: new Date(),
      },
    });
  } catch (error) {
    console.error(`Failed to send message to ${user.email}`, error);

    if (!fromRetryJob) {
      const retryJob = await prisma.retryJob.findFirst({
        where: {
          userId: user.id,
          status: 'pending',
        },
      });

      if (!retryJob) {
        await prisma.retryJob.create({
          data: {
            userId: user.id,
            retryCount: 0,
            status: 'pending',
            lastAttempt: new Date(),
            message: `Failed to send birthday email to ${user.firstName}`,
          },
        });
      }
    }
  }
};
