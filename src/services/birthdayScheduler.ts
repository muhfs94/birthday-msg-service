import { prisma } from '../utils/prismaClient';
import { scheduleJob } from 'node-schedule';
import { DateTime } from 'luxon';
import { sendBirthdayMessages } from './messageService';
import { User } from '@prisma/client';

const TEST_MODE = process.env.TEST_MODE === 'enabled';

export const scheduleBirthdayMessages = async () => {
  const today = DateTime.utc();
  const todayDay = today.day;
  const todayMonth = today.month;
  const oneYearAgo = today.minus({ years: 1 }).toJSDate();

  const users: User[] = await prisma.$queryRaw`
    SELECT * FROM "User"
    WHERE EXTRACT(DAY FROM "birthday") = ${todayDay}
    AND EXTRACT(MONTH FROM "birthday") = ${todayMonth}
    AND ("lastBirthdaySent" IS NULL OR "lastBirthdaySent" < ${oneYearAgo})`;

  console.log(`Found ${users.length} users with birthdays today`);

  for (const user of users) {
    let hour = 9;
    let minute = 0;
    let second = 0;

    if (TEST_MODE) {
      hour = DateTime.now().hour;
      minute = DateTime.now().minute;
      second = DateTime.now().second + 10;
    }

    const userTime = DateTime.utc().setZone(user.location).set({
      hour,
      minute,
      second,
      millisecond: 0,
    });

    const utcSendTime = userTime.toUTC();
    const delay = utcSendTime.diffNow().as('milliseconds');

    if (delay > 0) {
      console.log(
        `Scheduling birthday message for ${user.email} at ${utcSendTime.toFormat('yyyy-MM-dd HH:mm:ss')} timezone ${user.location}
        Their current time now is ${DateTime.now().setZone(user.location).toFormat('yyyy-MM-dd HH:mm:ss')}`
      );
      scheduleJob(utcSendTime.toJSDate(), async () => {
        sendBirthdayMessages(user, false);
      });
    } else {
      console.log(`Sending birthday message for ${user.email} immediately`);
      sendBirthdayMessages(user, false);
    }
  }
};
