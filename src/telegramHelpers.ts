import * as TelegramBot from 'node-telegram-bot-api';
import { bot } from './bot';
import { Chat } from './storage/entity/Chat';
import { createUUID } from './utils';

export function getChatId(
  target: Chat | TelegramBot.Message | string | number
) {
  if (typeof target === 'string' || typeof target === 'number') {
    return target.toString();
  }

  if ('id' in target) {
    return target.id;
  } else {
    return target.chat.id.toString();
  }
}

export function reply(
  target: TelegramBot.Message | Chat | string | number,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  const chatId = getChatId(target);
  return bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    ...options,
  });
}

export function deleteMessageByIds(
  chatId: number | string,
  messageId: number | string
) {
  return bot.deleteMessage(chatId, messageId.toString());
}

export function deleteMessage(msg: TelegramBot.Message) {
  return bot.deleteMessage(msg.chat.id, msg.message_id.toString());
}

export function editText(
  msg: TelegramBot.Message,
  text: string,
  options?: TelegramBot.EditMessageTextOptions
) {
  return bot.editMessageText(text, {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: 'Markdown',
    ...options,
  });
}

export function getFullName(msg: TelegramBot.Message) {
  return [msg.from?.first_name, msg.from?.last_name].filter(x => x).join(' ');
}

interface ButtonMenu {
  fromId: number;
  chatId: number;
  sentMessage: TelegramBot.Message;
}

interface ButtonMenuProps {
  title?: string;
  items: Array<{
    text: string;
    value: string;
  }>;
  timeout?: number;
  allowMultiple?: boolean;
  onSelect?: (message: TelegramBot.Message, value: string) => void;
}

let currentMenus: Array<ButtonMenu> = [];

function removeExistingMenu(message: TelegramBot.Message) {
  currentMenus = currentMenus.filter(menu => {
    if (menu.chatId === message.chat.id && menu.fromId === message.from?.id) {
      deleteMessage(menu.sentMessage);
      return false;
    }

    return true;
  });
}

export async function buttonMenu(
  msg: TelegramBot.Message,
  { title, items, onSelect, timeout, allowMultiple }: ButtonMenuProps
) {
  // Remove previous menu if there is any
  !allowMultiple && removeExistingMenu(msg);

  // Generate random ID so menus don't mix up
  const menuId = createUUID().substr(0, 8);

  const sentMessage = await reply(msg, title || '', {
    reply_markup: {
      inline_keyboard: [
        items.map(({ text, value }) => {
          return {
            text,
            callback_data: [menuId, value].join(' '),
          };
        }),
      ],
    },
  });

  const newMenu: ButtonMenu = {
    fromId: msg.from!.id,
    chatId: msg.chat.id,
    sentMessage,
  };

  let timeoutFunc: NodeJS.Timeout;

  currentMenus.push(newMenu);

  if (timeout) {
    console.log('settimeout');
    timeoutFunc = setTimeout(() => {
      removeExistingMenu(msg);
    }, timeout);
  }

  const onCallbackQuery = ({
    data,
    message: sentMessage,
  }: TelegramBot.CallbackQuery) => {
    if (!data) {
      return;
    }

    const [queryMenuId, ...rest] = data.split(' ');
    const value = rest.join(' ');

    if (!sentMessage || menuId !== queryMenuId) {
      return;
    }

    onSelect && onSelect(sentMessage, value);
    bot.removeListener('callback_query', onCallbackQuery);

    if (timeoutFunc) {
      clearTimeout(timeoutFunc);
    }
  };

  bot.on('callback_query', onCallbackQuery);
  return sentMessage;
}
