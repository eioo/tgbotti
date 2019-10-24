import Telegraf from 'telegraf';
import * as tt from 'telegram-typings';

import { loadCommands } from './commands/loader';
import { config } from './config';
import * as database from './storage/database';
import { setupUpdateHandlers } from './updates';

export const bot = new Telegraf(config.botToken);

async function launchBot() {
  await database.testConnection();
  console.log('Database connected');

  const { loadCount } = await loadCommands();
  console.log(`Loaded ${loadCount} commands`);

  setupUpdateHandlers();
  await bot.launch();
  console.log('Bot launched');
}

export function editMessageText(msg: tt.Message, text: string) {
  bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, text);
}

launchBot();
