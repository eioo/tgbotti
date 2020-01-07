import * as TelegramBot from 'node-telegram-bot-api';

import { bot } from './bot';

export function reply(
  msg: TelegramBot.Message,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  return bot.sendMessage(msg.chat.id, text, options);
}

export function replyWithMarkdown(
  msg: TelegramBot.Message,
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
