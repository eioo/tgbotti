import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { env } from '../env';
import { logger } from '../logger';
import { Chat } from './entity/Chat';

import TelegramBot = require('node-telegram-bot-api');

export let storage: Connection;

export async function connectToDatabase() {
  try {
    storage = await createConnection({
      type: 'postgres',
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
      logging: false,
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USERNAME,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DATABASE,
    });
  } catch (e) {
    logger.log('Could not connect to database');
    throw new Error(e);
  }
}

const getChatId = (target: string | number | TelegramBot.Message | Chat) => {
  if (typeof target === 'string' || typeof target === 'number') {
    return target.toString();
  }

  // Chat
  if ('id' in target) {
    return target.id.toString();
  }

  // TelegramBot.Message
  if ('chat' in target) {
    return target.chat.id.toString();
  }

  return '';
};

/** This can be:
 * @param target can be chat id in string or number, TelegramBot.Message, or Chat
 */
export async function getChat(
  target: string | number | TelegramBot.Message | Chat
) {
  const chatId = getChatId(target);
  const oldChat = await storage.getRepository(Chat).findOne({ id: chatId });

  if (oldChat) {
    return oldChat;
  }

  const newChat = new Chat();
  newChat.id = chatId;
  newChat.save();

  return newChat;
}
