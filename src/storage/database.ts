import { createPool, sql } from 'slonik';

import { config } from '../config';

export const slonik = createPool(config.postgresConnectionString);

export async function testConnection() {
  return slonik.query(sql`SELECT 1`);
}
