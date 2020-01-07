import * as TelegramBot from 'node-telegram-bot-api';

import { loadCommands } from './commands/loader';
import { config } from './config';
import { logger } from './logger';
import { connectToDatabase } from './storage';

export const bot = new TelegramBot(config.botToken);

function messageHandler() {
  bot.on('message', msg => {
    const { date, from } = msg;
    const timeSince = +new Date() / 1000 - date; // Seconds

    if (from && timeSince < 60) {
      const name = [from.first_name, from.last_name].filter(x => x).join(' ');
      const debugText = `Message from ${name}`;
      logger.log(debugText);
    }
  });
}

export async function launch() {
  await connectToDatabase();
  logger.log('Database connected');

  const { loadCount } = await loadCommands();
  logger.log(`Loaded ${loadCount} commands`);

  messageHandler();
  await bot.startPolling();
  logger.log('Bot launched');
}
