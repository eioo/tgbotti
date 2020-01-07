import { bot } from '../../bot';
import { replyWithMarkdown } from '../../telegramHelpers';

const description = 'Adds a reminder';

function load() {
  bot.onText(/xxx/i, msg => {
    replyWithMarkdown(msg, 'xDDD');
  });
}

export { description, load };
