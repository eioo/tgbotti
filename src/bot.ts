import * as TelegramBot from 'node-telegram-bot-api';
import { loadAllCommands } from './commands/commandLoader';
import { env } from './env';
import { logger } from './logger';
import { connectToDatabase } from './storage';
import { getFullName } from './telegramHelpers';

export const bot = new TelegramBot(env.BOT_TOKEN);

function messageHandler() {
  bot.on('message', msg => {
    const timeSince = Date.now() / 1000 - msg.date; // Seconds

    if (timeSince < 60) {
      logger.log(
        `Message from ${getFullName(msg)} (ID: ${msg.from?.id || '-'})`
      );
    }
  });
}

export async function launch() {
  await connectToDatabase();
  logger.log('Database connected');

  const { loadCount } = await loadAllCommands();
  logger.log(`Loaded ${loadCount} commands`);

  messageHandler();
  bot.startPolling();
  logger.log('Bot launched');
}
