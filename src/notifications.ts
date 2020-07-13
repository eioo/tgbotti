import { Job, RecurrenceRule, scheduleJob } from 'node-schedule';
import TelegramBot = require('node-telegram-bot-api');

import { Chat } from './storage/entity/Chat';
import { getChatId } from './telegramHelpers';

interface INotifications {
  [chatId: string]: {
    [notificationName: string]: {
      job: Job;
    };
  };
}

const notifications: INotifications = {};

export function addNotification(
  target: Chat | TelegramBot.Message,
  name: string,
  rule: RecurrenceRule,
  action: () => Promise<void> | void
) {
  const chatId = getChatId(target);

  notifications[chatId] = notifications[chatId] || {};
  notifications[chatId][name] = {
    job: scheduleJob(rule, action),
  };
}

export function removeNotificaton(
  target: Chat | TelegramBot.Message,
  name: string
) {
  const chatId = getChatId(target);
  const notification = notifications[chatId][name];

  if (notification) {
    notification.job.cancel();
    delete notifications[chatId][name];
  }
}
