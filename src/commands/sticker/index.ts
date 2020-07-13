import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { bot } from '../../bot';
import { reply } from '../../telegramHelpers';
import TelegramBot = require('node-telegram-bot-api');
import sharp = require('sharp');

const ALLOWED_MIMETYPES = ['image/png', 'image/jpeg'];

const activeUsers = new Set<number>();

function load() {
  bot.onText(/^\/sticker$/i, msg => {
    if (!msg.from) {
      return;
    }

    reply(msg, 'Send image without compression');

    const documentListener = async ({
      document,
      chat,
      from,
    }: TelegramBot.Message) => {
      if (!from || activeUsers.has(from.id)) return;

      activeUsers.add(from.id);

      const fileId = document?.file_id;
      const fileName = document?.file_name;
      const mimeType = document?.mime_type;

      if (
        !fileId ||
        !fileName ||
        !mimeType ||
        !ALLOWED_MIMETYPES.includes(mimeType)
      ) {
        return;
      }

      const fileStream = bot.getFileStream(fileId);
      const chunks = [];

      for await (const chunk of fileStream) {
        chunks.push(chunk);
      }

      const outputPath = path.join(os.tmpdir(), fileName);

      await sharp(Buffer.concat(chunks))
        .ensureAlpha()
        .resize({
          height: 512,
          width: 512,
          fit: 'inside',
        })
        .toFile(outputPath);

      await bot.sendDocument(chat.id, outputPath, {
        caption: 'Here is your sticker ready image',
      });

      bot.removeListener('document', documentListener);
      fs.unlinkSync(outputPath);
    };

    bot.addListener('document', documentListener);
  });
}
const description = 'Add sticker';

export { load, description };
