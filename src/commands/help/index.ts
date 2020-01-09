import { bot } from '../../bot';
import { reply } from '../../telegramHelpers';
import { commands } from '../loader';

function load() {
  bot.onText(/^\/help$/i, msg => {
    const responseLines = ['*Bot help*'];

    for (const [name, { description }] of Object.entries(commands)) {
      responseLines.push(`\`/${name}\` - ${description || '_No description_'}`);
    }

    const responseText = responseLines.join('\n');
    reply(msg, responseText);
  });
}

export { load };
