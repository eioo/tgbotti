import * as TelegramBot from 'node-telegram-bot-api';
import { bot } from './bot';
import { logger } from './logger';
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
  try {
    return bot.deleteMessage(msg.chat.id, msg.message_id.toString());
  } catch (e) {
    logger.warn(e.message);
  }
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

export function getFullName(
  msgOrUser?: TelegramBot.Message | TelegramBot.User
) {
  if (!msgOrUser) {
    return '';
  }

  if ('first_name' in msgOrUser) {
    const user = msgOrUser;
    return [user.first_name, user.last_name].filter(x => x).join(' ');
  } else {
    return [msgOrUser.from?.first_name, msgOrUser.from?.last_name]
      .filter(x => x)
      .join(' ');
  }
}

interface ButtonMenu {
  triggerMessage: TelegramBot.Message;
  menuMessage: TelegramBot.Message;
}

interface ButtonMenuProps {
  title?: string;
  items: Array<{
    text: string;
    value: string;
  }>;
  timeout?: number;
  allowMultiple?: boolean;
  userSpecific?: boolean;
  onSelect?: (message: TelegramBot.Message, value: string) => void;
}

const currentMenus: Record<string, ButtonMenu> = {};

function removeExistingMenu(message: TelegramBot.Message) {
  for (const [menuId, { menuMessage }] of Object.entries(currentMenus)) {
    if (
      menuMessage.chat.id === message.chat.id &&
      menuMessage.from?.id === message.from?.id
    ) {
      deleteMessage(menuMessage);
      delete currentMenus[menuId];
    }
  }
}

export async function buttonMenu(
  msg: TelegramBot.Message,
  {
    title,
    items,
    onSelect,
    timeout,
    allowMultiple,
    userSpecific,
  }: ButtonMenuProps
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

  currentMenus[menuId] = {
    triggerMessage: msg,
    menuMessage: sentMessage,
  };

  let timeoutFunc: NodeJS.Timeout;

  if (timeout) {
    timeoutFunc = setTimeout(() => {
      removeExistingMenu(msg);
    }, timeout);
  }

  const onCallbackQuery = async ({
    data,
    message: menuMessage,
    from,
  }: TelegramBot.CallbackQuery) => {
    if (!data) {
      return;
    }

    const [dataMenuId, ...rest] = data.split(' ');
    const value = rest.join(' ');

    if (!menuMessage || menuId !== dataMenuId) {
      return;
    }

    const menu = currentMenus[menuId];
    const ownerOfTheMenu = menu.triggerMessage.from?.id === from.id;

    if (userSpecific && !ownerOfTheMenu) {
      const stopMessage = await reply(
        menuMessage.chat.id,
        `😡 Stop pressing ${getFullName(
          menu.triggerMessage.from
        )}'s menu ${getFullName(from)}`
      );

      return setTimeout(() => {
        deleteMessage(stopMessage);
      }, 10000);
    }

    onSelect && onSelect(menuMessage, value);
    bot.removeListener('callback_query', onCallbackQuery);

    if (timeoutFunc) {
      clearTimeout(timeoutFunc);
    }
  };

  bot.on('callback_query', onCallbackQuery);
  return sentMessage;
}
