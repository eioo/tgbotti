import { bot } from '../../bot';
import { replyWithMarkdown } from '../../telegramHelpers';
import { commands } from '../loader';

function load() {
  bot.onText(/^\/help$/i, msg => {
    const responseLines = ['*Bot Help*'];

    for (const [name, { description }] of Object.entries(commands)) {
      responseLines.push(`\`/${name}\` - ${description || '_No description_'}`);
    }

    const responseText = responseLines.join('\n');
    replyWithMarkdown(msg, responseText);
  });
}

export { load };
