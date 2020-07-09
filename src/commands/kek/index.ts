import { bot } from '../../bot';
import { reply } from '../../telegramHelpers';
import { sample } from '../../utils';

const hidden = true;

function load() {
  bot.onText(/^kek$/, msg => {
    reply(msg, sample(['lol*', 'ite oot']), {
      parse_mode: 'HTML',
    });
  });
}

export { load, hidden };
