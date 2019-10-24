import { bot } from '../../bot';
import { commands } from '../loader';

function load() {
  bot.help(ctx => {
    const responseLines = ['*Bot Help*'];

    for (const [name, { description }] of Object.entries(commands)) {
      responseLines.push(`\`/${name}\` - ${description || '_No description_'}`);
    }

    const responseText = responseLines.join('\n');
    ctx.replyWithMarkdown(responseText);
  });
}

export { load };
