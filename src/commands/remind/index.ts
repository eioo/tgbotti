import * as dateFormat from 'dateformat';
import * as schedule from 'node-schedule';

import { bot } from '../../bot';
import { logger } from '../../logger';
import { Reminder } from '../../storage/entity/Reminder';
import { getFullName, reply } from '../../telegramHelpers';
import { parseReminder } from './parser';

const description = 'Adds a reminder';

async function notifyReminder(reminder: Reminder) {
  let text = `*🔔 Reminder for* [${reminder.askerName}](tg://user?id=${reminder.askerId})`;

  if (reminder.text) {
    text += `\n${reminder.text}`;
  }

  await reply(reminder.chatId, text);
  reminder.notified = true;
  await reminder.save();
}

function scheduleReminder(reminder: Reminder) {
  schedule.scheduleJob(reminder.date, () => notifyReminder(reminder));
}

async function loadOldReminders() {
  const unnotifiedReminders = await Reminder.find({ notified: false });
  const now = new Date();
  let scheduleCount = 0;

  for (const reminder of unnotifiedReminders) {
    if (reminder.date > now) {
      scheduleReminder(reminder);
      scheduleCount++;
    } else {
      notifyReminder(reminder);
    }
  }

  if (scheduleCount) {
    logger.log(`Scheduled ${scheduleCount} reminders`);
  }
}

async function load() {
  await loadOldReminders();

  bot.onText(/^\/remind/i, async msg => {
    if (!msg.text || !msg.from) {
      return;
    }

    const args = msg.text.split(' ').splice(1);
    const argsText = args.join(' ');

    if (args.length >= 1) {
      const parsed = parseReminder(argsText);

      if (!parsed) {
        return reply(msg, '👎 Could not parse remind time');
      }

      const now = new Date();

      if (parsed.date <= now) {
        return reply(msg, "🤦‍♂️ I can't time travel _(yet)_");
      }

      const reminder = new Reminder();
      reminder.text = parsed.text;
      reminder.date = parsed.date;
      reminder.askerName = getFullName(msg);
      reminder.chatId = msg.chat.id.toString();
      reminder.askerId = msg.from.id.toString();
      await reminder.save();

      scheduleReminder(reminder);

      const timestamp = dateFormat(parsed.date, 'HH:MM:ss dd.mm.yyyy');
      const lines = ['*🔔 Reminder set!*', `*When:* ${timestamp}`];

      if (parsed.text) {
        lines.push(`*Text:* ${parsed.text}`);
      }

      await reply(msg, lines.join('\n'));
    }
  });
}

export { description, load };
