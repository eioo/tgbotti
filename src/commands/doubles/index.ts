import { bot } from '../../bot';
import { editText, reply } from '../../telegramHelpers';
import { Roll, TriplesRoll } from './Roll';

const description = 'Tuplas will tell the truth';

function load() {
  bot.onText(/^(tuplat päättää|\/doubles$)/i, async msg => {
    const sentMsg = await reply(msg, '🎲🎲🎲 Rolling 🎲🎲🎲');

    await new Promise(resolve => setTimeout(resolve, 2500));

    const roll = new Roll();
    const response = roll.isOnlySameNumbers
      ? `🎲 \`[${roll.roll}]\` You rolled doubles! :))`
      : `🎲 \`[${roll.roll}]\` No doubles for u :((`;

    editText(sentMsg, response);
  });

  bot.onText(
    /^(\/(triples?|triplat?)|triplat päättää|triploilla)/i,
    async msg => {
      const sentMsg = await reply(msg, '🎲🎲🎲 Rolling 🎲🎲🎲');

      await new Promise(resolve => setTimeout(resolve, 2500));

      const roll = new TriplesRoll();
      const response = roll.isOnlySameNumbers
        ? `🎲 \`[${roll.roll}]\` You rolled triples! :))`
        : `🎲 \`[${roll.roll}]\` No triples for u :((`;

      editText(sentMsg, response);
    }
  );
}

export { description, load };
