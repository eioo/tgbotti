import Telegraf from 'telegraf';

import { loadCommands } from './commands/loader';
import { config } from './config';
import { logger } from './logger';
import { connectToDatabase } from './storage';
import { setupUpdateHandlers } from './updates';

export const bot = new Telegraf(config.botToken);

async function launchBot() {
  await connectToDatabase();
  logger.log('Database connected');

  const { loadCount } = await loadCommands();
  logger.log(`Loaded ${loadCount} commands`);

  setupUpdateHandlers();
  await bot.launch();
  logger.log('Bot launched');
}

launchBot();
