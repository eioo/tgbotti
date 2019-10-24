import { bot } from './bot';

export function setupUpdateHandlers() {
  bot.on('message', async ctx => {
    if (!ctx.message) {
      return;
    }

    const { from } = ctx.message;

    if (from) {
      const name = [from.first_name, from.last_name].filter(x => x).join(' ');
      const debugText = `Message from ${name}`;
      console.log(debugText);
    }
  });
}
