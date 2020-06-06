import { bot } from '../../bot';
import { editText, reply } from '../../telegramHelpers';

const description = 'Tuplas will tell the truth';

function load() {
  const regex = /^(tuplat päättää|\/doubles$)/;

  bot.onText(regex, async msg => {
    const rollMsg = await reply(msg, '🎲🎲🎲 _Rolling_ 🎲🎲🎲');

    const randomNumber = Math.floor(Math.random() * 100);
    const paddedNumber = randomNumber.toString().padStart(2, '0');
    const response = `🎲 \`[${paddedNumber}]\` No doubles for u :((`;

    setTimeout(() => {
      editText(rollMsg, response);
    }, 3000);
  });
}

export { description, load };
