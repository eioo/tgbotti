import * as fs from 'fs';
import * as path from 'path';
import { sample } from '../../utils';
import { bot } from './../../bot';

function getRandomSound() {
  const soundDir = path.join(__dirname, 'sounds');
  const randomFile = path.join(soundDir, sample(fs.readdirSync(soundDir)));
  return fs.createReadStream(randomFile);
}

export function load() {
  bot.onText(/\w+22/i, msg => {
    bot.sendVoice(msg.chat.id, getRandomSound());
  });
}
