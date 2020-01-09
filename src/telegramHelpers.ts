import * as TelegramBot from 'node-telegram-bot-api';

import { bot } from './bot';
import { Chat } from './storage/entity/Chat';

export function getChatId(target: Chat | TelegramBot.Message | string) {
  if (typeof target === 'string') {
    return target;
  }

  if ('id' in target) {
    return target.id;
  } else {
    return target.chat.id.toString();
  }
}

export function reply(
  target: TelegramBot.Message | Chat | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  const chatId = getChatId(target);
  return bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    ...options,
  });
}

export function editMessageText(
  msg: TelegramBot.Message,
  text: string,
  options?: TelegramBot.EditMessageTextOptions
) {
  return bot.editMessageText(text, {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: 'Markdown',
    ...options,
  });
}

export function getFullName(msg: TelegramBot.Message) {
  return [msg.from?.first_name, msg.from?.last_name].filter(x => x).join(' ');
}
