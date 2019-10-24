import Telegraf from 'telegraf';

import { loadCommands } from './commands/loader';
import { config } from './config';
import { logger } from './logger';
import * as database from './storage/database';
import { setupUpdateHandlers } from './updates';

export const bot = new Telegraf(config.botToken);

async function launchBot() {
  await database.testConnection();
  logger.log('Database connected');

  const { loadCount } = await loadCommands();
  logger.log(`Loaded ${loadCount} commands`);

  setupUpdateHandlers();
  await bot.launch();
  logger.log('Bot launched');
}

launchBot();
