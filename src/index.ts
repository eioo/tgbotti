process.env['NTBA_FIX_319'] = '1';
process.env['NTBA_FIX_350'] = '1';

import * as bot from './bot';
import { logger } from './logger';

bot.launch();

process.on('unhandledRejection', (error: any) => {
  logger.error(error.message);
  console.error(error);
});
