import { bot } from '../../bot';
import { replyWithMarkdown } from '../../telegramHelpers';
import { parseDate, parseDuration, parseTime } from './parseDuration';

const description = 'Adds a reminder';

function parseDateFromString(str: string) {
  const duration = parseDuration(str);

  if (duration) {
    return new Date(Date.now() + duration);
  }

  const parsedDate = parseDate(str);
  const parsedTime = parseTime(str);

  if (!parsedDate && !parsedTime) {
    return;
  }

  const date = new Date();

  if (parsedDate) {
    date.setDate(parsedDate.days);
    date.setMonth(parsedDate.months);
    date.setFullYear(parsedDate.years);
  }

  if (parsedTime) {
    date.setSeconds(parsedTime.seconds);
    date.setMinutes(parsedTime.minutes);
    date.setHours(parsedTime.hours);
  }

  return date;
}

function load() {
  bot.onText(/^\/remind/i, msg => {
    if (!msg.text) {
      return;
    }

    const args = msg.text.split(' ').splice(1);
    const argsText = args.join(' ');

    if (args.length >= 1) {
      const date = parseDateFromString(argsText);

      if (!date) {
        return replyWithMarkdown(msg, 'Could not parse remind time');
      }

      console.log(date.toLocaleString());
    }
  });
}

export { description, load };
