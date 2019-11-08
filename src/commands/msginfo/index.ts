import * as tt from 'telegram-typings';

import { bot } from '../../bot';

const description = "Sends info about sent message";
const state = new Map<number, tt.Message>();

function load() {
  bot.command('msginfo', async ctx => {
    const { chat, from } = ctx;

    if (!chat || !from) {
      return;
    }

    const msg = await ctx.replyWithMarkdown('_Waiting for message..._');
    state.set(chat.id, msg as tt.Message);
  });

  bot.on('message', async ctx => {
    const { chat, from, message } = ctx;

    if (!chat || !from || !message) {
      return;
    }

    const waitMessage = state.get(chat.id);

    if (!waitMessage) {
      return;
    }

    state.delete(chat.id);
    await ctx.telegram.deleteMessage(chat.id, waitMessage.message_id);

    const data: StringMap<number | string> = {
      'Chat ID': chat.id,
      'User ID': from.id,
    };

    const { audio, sticker, photo, video, voice } = message;

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

    ctx.replyWithMarkdown(response);
  });
}

export { description, load };
