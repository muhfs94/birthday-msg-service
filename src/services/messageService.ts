import axios from 'axios';
import { User } from '@prisma/client';
import { prisma } from '../database';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const sendBirthdayMessage = async (
  user: User,
  message: string,
  retries = 0
) => {
  try {
    await axios.post('https://email-service.digitalenvision.com.au', {
      to: user.email,
      subject: 'Happy Birthday!',
      body: message,
    });
    console.log(
      `Birthday message sent to ${user.firstName} ${user.lastName} (${user.email})`
    );
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(
        `Retrying to send birthday message to ${user.firstName} ${user.lastName}... Attempt ${retries + 1}`
      );
      setTimeout(() => {
        sendBirthdayMessage(user, message, retries + 1);
      }, RETRY_DELAY);
    } else {
      await prisma.failedMessage.create({
        data: {
          userId: user.id,
          messageType: 'birthday',
          errorMsg: JSON.stringify(error),
          createdAt: new Date(),
        },
      });
      console.error(
        `Failed to send birthday message to ${user.firstName} ${user.lastName} (${user.email}): ${error}`
      );
    }
  }
};

// Add sendAnniversaryMessage service here

export { sendBirthdayMessage };
