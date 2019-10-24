import { bot, editMessageText } from '../../bot';

const description = 'Tuplas will tell the truth';

function load() {
  const regex = /^(tuplat päättää|\/doubles$)/;

  bot.hears(regex, async ctx => {
    const msg = await ctx.reply('🎲🎲🎲 Rolling 🎲🎲🎲');
    const randomNumber = Math.floor(Math.random() * 100);
    const paddedNumber = randomNumber.toString().padStart(2, '0');
    const response = `🎲 \`[${paddedNumber}]\` No doubles for u :((`;

    setTimeout(() => {
      editMessageText(msg, response);
    }, 3000);
  });
}

export { description, load };
