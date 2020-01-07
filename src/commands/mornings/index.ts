import TelegramBot = require('node-telegram-bot-api');

import { bot } from '../../bot';
import { Chat } from '../../storage/entity/Chat';
import { replyWithMarkdown } from '../../telegramHelpers';

function load() {
  const changeState = async (msg: TelegramBot.Message, state: boolean) => {
    if (!msg.chat) {
      return;
    }

    const chat = new Chat(msg.chat.id);
    const { weather } = chat.settings;
    weather.notifications = state;
    await chat.save();

    const response = `*Notifications* ${weather.notifications ? '✅' : '❌'}`;
    await replyWithMarkdown(msg, response);
  };

  bot.onText(/^\/enable$/i, msg => changeState(msg, true));
  bot.onText(/^\/disable$/i, msg => changeState(msg, false));
}

export { load };
