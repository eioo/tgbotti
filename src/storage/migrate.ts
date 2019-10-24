import { setupSlonikMigrator } from '@slonik/migrator';
import * as path from 'path';
import { createPool } from 'slonik';

import { config } from '../config';

const pool = createPool(config.postgresConnectionString);

const migrator = setupSlonikMigrator({
  migrationsPath: path.resolve(__dirname + '../../../migrations'),
  slonik: pool,
  mainModule: module,
});

export { pool, migrator };
