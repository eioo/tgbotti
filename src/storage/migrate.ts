import { setupSlonikMigrator } from '@slonik/migrator';
import * as path from 'path';
import { createPool } from 'slonik';

import { config } from '../config';

console.log(config.postgresConnectionString);
const slonik = createPool(config.postgresConnectionString);

const migrator = setupSlonikMigrator({
  migrationsPath: path.resolve(__dirname + '../../../migrations'),
  slonik,
  mainModule: module,
});

export { slonik, migrator };
