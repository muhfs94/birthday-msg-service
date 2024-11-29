import nodeSchedule from 'node-schedule';
import { scheduleBirthdayMessages } from '../services/birthdayScheduler';
import { DateTime } from 'luxon';

const TEST_MODE = process.env.TEST_MODE === 'enabled';

export const initializeDailyScheduler = () => {
  const rule = new nodeSchedule.RecurrenceRule();

  if (TEST_MODE) {
    rule.hour = DateTime.now().hour;
    rule.minute = DateTime.now().minute;
    rule.second = DateTime.now().second + 5;
    console.log(`Daily scheduler initialized with test mode enabled`);
  } else {
    rule.hour = 0;
    rule.minute = 0;
  }
  console.log({rule})

  nodeSchedule.scheduleJob(rule, scheduleBirthdayMessages);
};
