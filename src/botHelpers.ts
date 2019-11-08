import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import * as tt from 'telegram-typings';

import { bot } from './bot';

export function editMessageText(
  msg: tt.Message,
  text: string,
  extra?: ExtraEditMessage
) {
  bot.telegram.editMessageText(
    msg.chat.id,
    msg.message_id,
    undefined,
    text,
    extra
  );
}

export function editMessageTextMarkdown(msg: tt.Message, text: string) {
  editMessageText(msg, text, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    parse_mode: 'Markdown',
  });
}
