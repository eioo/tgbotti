import { ContextMessageUpdate } from 'telegraf';

import { bot } from '../../bot';
import { getChat, updateChat } from '../../storage/database';

function load() {
  const changeState = async (ctx: ContextMessageUpdate, state: boolean) => {
    if (!ctx.chat) {
      return;
    }

    await updateChat(ctx.chat.id, {
      test: state,
    });

    const chat = await getChat(ctx.chat.id);
    await ctx.reply(chat.test.toString());
  };

  bot.command('enable', ctx => changeState(ctx, true));
  bot.command('disable', ctx => changeState(ctx, false));
}

export { load };
