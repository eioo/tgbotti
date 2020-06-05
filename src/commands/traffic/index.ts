import { bot } from '../../bot';
import { getChat } from '../../storage';
import { editMessageText, reply } from '../../telegramHelpers';
import { getTrafficCamera, validTrafficCameraUrl } from './service';

function load() {
  bot.onText(/^\/traffic$/, async msg => {
    const chat = await getChat(msg);
    const { cameras } = chat.settings.traffic;

    if (!cameras.length) {
      return reply(
        msg,
        `👎 No traffic cameras added\n\`/traffic add <kelikamerat.info url>\``
      );
    }

    for (const { url } of cameras) {
      const camera = await getTrafficCamera(url);

      if (!camera.imageUrl) {
        console.log('eioo');
        return;
      }

      await reply(
        msg,
        `🌦 *Kelikamera* 📷
  Nimi | \`${camera.name}\`
  Lämpötila | \`${camera.airTemperature}°C\`
  Tuulen nopeus | \`${camera.windSpeed} m/s\``
      );
      await bot.sendPhoto(msg.chat.id, camera.imageUrl);
    }
  });

  bot.onText(/^\/traffic add/, async msg => {
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
      editMessageText(sentMsg, '❌ Ei löytynyt kelikameraa');
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

    editMessageText(sentMsg, `✅ Lisättiin uusi kamera | \`${camera.name}\``);
    return;
  });

  bot.onText(/^\/traffic (remove|delete)/, async msg => {
    const chat = await getChat(msg);
    const { cameras } = chat.settings.traffic;
    const args = msg.text!.split(' ').splice(1);

    if (args.length < 2) {
      // TODO: Show help
      return;
    }

    const cameraName = args
      .splice(1)
      .join('')
      .toLowerCase();

    let cameraFound = false;
    chat.settings.traffic.cameras = cameras.filter(camera => {
      const match = camera.name.toLowerCase() === cameraName;

      if (match) {
        cameraFound = true;
      }

      return !match;
    });

    if (cameraFound) {
      await chat.save();
      reply(msg, '🗑 Kamera poistettu');
    } else {
      reply(msg, '👎 Ei tuon nimistä kameraa');
    }
  });

  bot.onText(/^\/traffic (list|cameras?)/, async msg => {
    const chat = await getChat(msg);

    reply(
      msg,
      `🌦 *Chatin kelikamerat* 📷\n` +
        chat.settings.traffic.cameras
          .map(camera => `● ${camera.name}`)
          .join('\n')
    );
  });
}

export { load };
