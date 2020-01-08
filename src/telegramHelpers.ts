import * as TelegramBot from 'node-telegram-bot-api';

import { bot } from './bot';

export function reply(
  msg: TelegramBot.Message | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  const chatId = typeof msg === 'string' ? msg : msg.chat.id;
  return bot.sendMessage(chatId, text, options);
}

export function replyWithMarkdown(
  msg: TelegramBot.Message | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  return reply(msg, text, {
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
    ...options,
  });
}

export function editMessageTextMarkdown(
  msg: TelegramBot.Message,
  text: string,
  options?: TelegramBot.EditMessageTextOptions
) {
  return editMessageText(msg, text, {
    parse_mode: 'Markdown',
    ...options,
  });
}

export function getFullName(msg: TelegramBot.Message) {
  if (!msg.from) {
    return '';
  }

  return (
    msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : '')
  );
}
