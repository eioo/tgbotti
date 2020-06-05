import * as dateFormat from 'dateformat';
import { bot } from '../../bot';
import {
  addNotification,
  removeNotificaton as removeNotification,
} from '../../notifications';
import { getChat } from '../../storage';
import { Chat } from '../../storage/entity/Chat';
import { reply } from '../../telegramHelpers';
import { sendTraffic } from '../traffic';
import { getTodaysHoliday } from './holidayEvents';
import TelegramBot = require('node-telegram-bot-api');

async function sendMornings(target: Chat | TelegramBot.Message) {
  const chat = await getChat(target);
  let text = `*Mornings!*\nTänään on ${dateFormat('dd.mm.yyyy')}`;
  const holiday = await getTodaysHoliday();

  if (holiday) {
    text += `\n[${holiday.name}](${holiday.url})`;
  }

  await reply(chat, text);

  if (chat.settings.mornings.showTraffic) {
    return sendTraffic(chat, true);
  }
}

async function load() {
  bot.onText(/^\/mornings/i, async msg => {
    if (!msg.text) {
      return;
    }

    const args = msg.text.split(' ').splice(1);
    console.log(msg.text, args);
    const chat = await getChat(msg);
    const { mornings: settings } = chat.settings;

    if (!args.length) {
      return sendMornings(msg);
    }

    const { notificationRule } = settings;
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
        sendTraffic(chat);
      });
    }
  }
}

export { load };
