import 'reflect-metadata';

import TelegramBot = require('node-telegram-bot-api');
import { Connection, createConnection } from 'typeorm';

import { env } from '../env';
import { logger } from '../logger';
import { Chat } from './entity/Chat';

export let storage: Connection;

export async function connectToDatabase() {
  try {
    storage = await createConnection({
      type: 'postgres',
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
      logging: false,
      ...env.postgres,
    });
  } catch (e) {
    logger.log('Could not connect to database');
    throw new Error(e);
  }
}

export async function getChat(
  idOrMessage: string | number | TelegramBot.Message
) {
  const chatId =
    typeof idOrMessage === 'object'
      ? idOrMessage.chat.id.toString()
      : idOrMessage.toString();
  const oldChat = await storage.getRepository(Chat).findOne({ id: chatId });

  if (oldChat) {
    return oldChat;
  }

  const newChat = new Chat();
  newChat.id = chatId;
  newChat.save();

  return newChat;
}
