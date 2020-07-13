import axios from 'axios';
import { bot } from '../../bot';
import { env } from '../../env';
import { logger } from './../../logger';

const getRandomImage = async () => {
  try {
    const { data } = await axios.get(`https://api.giphy.com/v1/gifs/random`, {
      params: {
        api_key: env.GIPHY_API_KEY,
        tag: 'laugh',
        rating: 'R',
      },
    });

    return data.data.images.original.url;
  } catch (e) {
    logger.warn('Could not get "reps" command image');
  }
};

function load() {
  if (!env.GIPHY_API_KEY) {
    logger.log('Reps command not loaded (No Giphy API key)');
  }

  bot.onText(/(reps|repesin|huuts|huut(i|o)o?(a|i|st?a?))/i, async msg => {
    // Don't spam everytime
    if (Math.random() < 0.7) {
      return;
    }

    const imageUrl = await getRandomImage();

    bot.sendDocument(msg.chat.id, imageUrl, {
      disable_notification: true,
    });
  });
}

const hidden = true;

export { load, hidden };
