import { createPool, sql } from 'slonik';

import { config } from '../config';
import { IChat } from '../types/database';
import { createCaseInterceptor, toSnakeCase } from './caseInterceptor';

export const slonik = createPool(config.postgresConnectionString, {
  interceptors: [createCaseInterceptor()],
});

export async function testConnection() {
  return slonik.query(sql`SELECT 1`);
}

async function addNewChat(chatId: number) {
  return slonik.query(sql`
    INSERT INTO chats (id) VALUES (${chatId}) ON CONFLICT DO NOTHING
  `);
}

export async function getChat(chatId: number) {
  await addNewChat(chatId);

  return slonik.one<IChat>(sql`
    SELECT * FROM chats WHERE id = ${chatId}
  `);
}

export async function updateChat(chatId: number, changes: Partial<IChat>) {
  await addNewChat(chatId);

  return slonik.transaction(async transaction => {
    for (const [column, value] of Object.entries(changes)) {
      // Slonik's interceptors transformQuery is limited,
      // have to convert to snake case here.
      const identifier = sql.identifier([toSnakeCase(column)]);

      await transaction.query(sql`
        UPDATE chats SET ${identifier} = ${value!} WHERE id = ${chatId};
      `);
    }
  });
}
