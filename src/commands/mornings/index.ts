import * as dateFormat from 'dateformat';
import { bot } from '../../bot';
import {
  addNotification,
  removeNotificaton as removeNotification,
} from '../../notifications';
import { getChat } from '../../storage';
import { Chat } from '../../storage/entity/Chat';
import { getChatId, reply } from '../../telegramHelpers';
import { getTodaysHoliday } from './holidayEvents';
import TelegramBot = require('node-telegram-bot-api');

async function sendMornings(target: Chat | TelegramBot.Message) {
  const chatId = getChatId(target);
  let text = `*Mornings!*\nTänään on ${dateFormat('dd.mm.yyyy')}`;
  const holiday = await getTodaysHoliday();

  if (holiday) {
    text += `\n[${holiday.name}](${holiday.url})`;
  }

  return reply(chatId, text);
}

async function load() {
  bot.onText(/^\/mornings/i, async msg => {
    if (!msg.text) {
      return;
    }

    const args = msg.text.split(' ').splice(1);

    if (!args.length) {
      return sendMornings(msg);
    }

    const chat = await getChat(msg);
    const { notificationRule } = chat.settings.mornings;
    const firstArg = args[0].toLowerCase();

    if (firstArg === 'enable') {
      addNotification(chat, 'mornings', notificationRule, () => {
        sendMornings(chat);
      });
      return reply(chat, `✅ *Notifications enabled*`);
    }

    if (firstArg === 'disable') {
      removeNotification(msg, 'mornings');
      return reply(chat, `❌ *Notifications disabled*`);
    }
  });

  const chats = await Chat.find();

  for (const chat of chats) {
    const { notificationRule, notifications } = chat.settings.mornings;

    if (notifications) {
      addNotification(chat, 'mornings', notificationRule, () => {
        sendMornings(chat);
      });
    }
  }
}

export { load };
