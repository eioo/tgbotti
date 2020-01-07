import TelegramBot = require('node-telegram-bot-api');

import { bot } from '../../bot';
import { replyWithMarkdown } from '../../telegramHelpers';

const description = 'Sends info about sent message';
const state = new Map<number, TelegramBot.Message>();

function load() {
  bot.onText(/^\/msginfo$/i, async msg => {
    const { chat, from } = msg;

    if (!chat || !from) {
      return;
    }

    const waitMsg = await replyWithMarkdown(msg, '_Waiting for message..._');
    state.set(chat.id, waitMsg);
  });

  bot.on('message', async msg => {
    const { chat, from } = msg;

    if (!chat || !from) {
      return;
    }

    const waitMessage = state.get(chat.id);

    if (!waitMessage) {
      return;
    }

    state.delete(chat.id);
    await bot.deleteMessage(chat.id, waitMessage.message_id.toString());

    const data: Record<string, number | string> = {
      'Chat ID': chat.id,
      'User ID': from.id,
    };

    const { audio, sticker, photo, video, voice } = msg;

    if (audio) {
      data['Audio ID'] = audio.file_id;
    }

    if (photo) {
      data['Photo ID'] = photo[0].file_id;
    }

    if (sticker) {
      data['Sticker ID'] = sticker.file_id;
    }

    if (video) {
      data['Video ID'] = video.file_id;
    }

    if (voice) {
      data['Voice ID'] = voice.file_id;
    }

    const response = Object.entries(data)
      .map(([key, value]) => `*${key}*: \`${value}\``)
      .join('\n');

    replyWithMarkdown(msg, response);
  });
}

export { description, load };
