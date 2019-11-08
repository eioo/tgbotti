import { bot } from './bot';
import { logger } from './logger';

export function setupUpdateHandlers() {
  bot.on('message', ctx => {
    if (!ctx.message || !ctx.chat) {
      return;
    }

    const { date, from } = ctx.message;
    const timeSince = +new Date() / 1000 - date; // Seconds

    if (from && timeSince < 60) {
      const name = [from.first_name, from.last_name].filter(x => x).join(' ');
      const debugText = `Message from ${name}`;
      logger.log(debugText);
    }
  });
}
