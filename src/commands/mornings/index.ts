import TelegramBot = require('node-telegram-bot-api');

import { bot } from '../../bot';
import { getChat } from '../../storage';
import { replyWithMarkdown } from '../../telegramHelpers';

function load() {
  const changeState = async (msg: TelegramBot.Message, state: boolean) => {
    const chat = await getChat(msg);
    const { mornings } = chat.settings;
    mornings.notifications = state;
    await chat.save();

    const response = `*Notifications* ${mornings.notifications ? '✅' : '❌'}`;
    await replyWithMarkdown(msg, response);
  };

  bot.onText(/^\/enable$/i, msg => changeState(msg, true));
  bot.onText(/^\/disable$/i, msg => changeState(msg, false));
}

export { load };
