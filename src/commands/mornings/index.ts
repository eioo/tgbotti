import { ContextMessageUpdate } from 'telegraf';

import { bot } from '../../bot';
import { Chat } from '../../storage/entity/Chat';

function load() {
  const changeState = async (ctx: ContextMessageUpdate, state: boolean) => {
    if (!ctx.chat) {
      return;
    }

    const chat = new Chat(ctx.chat.id);
    const { weather } = chat.settings;
    weather.notifications = state;
    await chat.save();

    const response = `*Notifications* ${weather.notifications ? '✅' : '❌'}`;
    await ctx.replyWithMarkdown(response);
  };

  bot.command('enable', ctx => changeState(ctx, true));
  bot.command('disable', ctx => changeState(ctx, false));
}

export { load };
