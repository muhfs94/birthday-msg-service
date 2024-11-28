import cron from 'node-cron';
import { prisma } from '../database';
import { sendBirthdayMessage } from '../services/messageService';
import { startOfDay, endOfDay } from 'date-fns';

const scheduleBirthdayMessages = () => {
  cron.schedule('0 9 * * *', async () => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const users = await prisma.user.findMany({
      where: {
        birthday: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    for (const user of users) {
      const { firstName, lastName } = user;
      const message = `Hey, ${firstName} ${lastName}, it's your birthday!`;

      await sendBirthdayMessage(user, message);
    }
  });
};

export { scheduleBirthdayMessages };
