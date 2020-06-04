import { bot } from '../../bot';
import { reply } from '../../telegramHelpers';
import { commands } from '../loader';

const description = 'Show help';

function load() {
  bot.onText(/^\/help$/i, msg => {
    const responseText =
      '*Bot help*' +
      Object.entries(commands)
        .filter(([, { hidden }]) => !hidden)
        .map(
          ([name, { description }]) =>
            `\`/${name}\` - ${description || '_No description_'}`
        )
        .join('\n');

    reply(msg, responseText);
  });
}

export { load, description };
