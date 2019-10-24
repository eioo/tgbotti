import { bot } from '../../bot';
import { commands } from '../loader';

function load() {
  bot.help(ctx => {
    const responseLines = ['*Bot Help*'];

    for (const [name, command] of Object.entries(commands)) {
      const description = command.description || '_No description_';
      responseLines.push(`\`/${name}\` - ${description}`);
    }

    const responseText = responseLines.join('\n');

    ctx.reply(responseText, {
      parse_mode: 'Markdown',
    });
  });
}

export { load };
