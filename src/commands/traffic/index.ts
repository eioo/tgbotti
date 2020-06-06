import { bot } from '../../bot';
import { getChat } from '../../storage';
import {
  buttonMenu,
  editText,
  getFullName,
  reply,
} from '../../telegramHelpers';
import { logger } from './../../logger';
import { Chat } from './../../storage/entity/Chat';
import { getTrafficCamera, validTrafficCameraUrl } from './service';
import TelegramBot = require('node-telegram-bot-api');

export async function sendTraffic(
  target: Chat | TelegramBot.Message,
  hideNoCamerasMessage = false
) {
  const chat = await getChat(target);
  const { cameras } = chat.settings.traffic;

  if (!hideNoCamerasMessage && !cameras.length) {
    return reply(
      chat.id,
      `👎 Ei kelikameroita\n\`/traffic add <kelikamerat.info url>\``
    );
  }

  for (const { url } of cameras) {
    const camera = await getTrafficCamera(url);

    if (!camera.imageUrl) {
      logger.warn('Could not get camera image url? Camera:', camera);
      return;
    }

    await reply(
      chat.id,
      `🌦 *Kelikamera* 📷
Nimi | \`${camera.name}\`
Lämpötila | \`${camera.airTemperature}°C\`
Tuulen nopeus | \`${camera.windSpeed} m/s\``
    );
    await bot.sendPhoto(chat.id, camera.imageUrl);
  }
}

async function addCamera(msg: TelegramBot.Message) {
  const chat = await getChat(msg);
  const { cameras } = chat.settings.traffic;

  const args = msg.text!.split(' ').splice(1);

  if (args.length !== 2) {
    // TODO: Show help
    return;
  }

  const cameraUrl = args[1];

  if (!validTrafficCameraUrl(cameraUrl)) {
    return reply(msg, '❌ Ei ole `kelikamerat.info` URL');
  }

  const sentMsg = await reply(msg, '_Tarkistetaan..._');
  const camera = await getTrafficCamera(cameraUrl);

  if (!camera.name) {
    editText(sentMsg, '❌ Ei löytynyt kelikameraa');
    return;
  }

  chat.settings.traffic.cameras = [
    ...cameras,
    {
      url: cameraUrl,
      name: camera.name,
    },
  ];
  await chat.save();

  editText(sentMsg, `✅ Lisättiin uusi kamera | \`${camera.name}\``);
  return;
}

async function removeCamera(msg: TelegramBot.Message) {
  if (!msg.from) {
    return;
  }

  const chat = await getChat(msg);
  const { cameras } = chat.settings.traffic;

  buttonMenu(msg, {
    title: `🗑 Minkä haluat poistaa ${getFullName(msg)}?`,
    items: cameras.map(camera => ({
      text: `📷 ${camera.name}`,
      value: camera.name,
    })),
    timeout: 30000,
    onSelect: async (msg, value) => {
      chat.settings.traffic.cameras = cameras.filter(
        camera => camera.name !== value
      );
      await chat.save();
      editText(msg, `✅ *${value}* poistettu`);
    },
  });
}

async function listCameras(msg: TelegramBot.Message) {
  const chat = await getChat(msg);

  reply(
    msg,
    `🌦 *Chatin kelikamerat* 📷\n` +
      chat.settings.traffic.cameras.map(camera => `● ${camera.name}`).join('\n')
  );
}

export function load() {
  bot.onText(/^\/traffic$/, msg => sendTraffic(msg));
  bot.onText(/^\/traffic add/, addCamera);
  bot.onText(/^\/traffic (remove|delete)/, removeCamera);
  bot.onText(/^\/traffic (list|cameras?)/, listCameras);
}
