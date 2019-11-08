import 'reflect-metadata';

import { Connection, createConnection } from 'typeorm';

import { config } from '../config';
import { logger } from '../logger';

export let storage: Connection;

export async function connectToDatabase() {
  try {
    const { host, port, username, password, database } = config.postgres;

    storage = await createConnection({
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
      logging: false,
    });
  } catch (e) {
    logger.log('Could not connect to database');
    throw new Error(e);
  }
}
