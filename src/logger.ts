import { format } from 'date-fns';

/* eslint-disable @typescript-eslint/no-explicit-any */
const reset = '\x1b[0m';
const blue = '\x1b[34m';
const cyan = '\x1b[36m';
const red = '\x1b[31m';
const yellow = '\x1b[33m';

const createLogFn = (level: string, color: string) => (
  message?: any,
  ...optionalParams: any[]
) => {
  const timestamp = cyan + format(new Date(), 'dd.MM. HH:mm:ss') + reset;
  const levelStr = color + level.padEnd(8, ' ') + reset;
  console.log(`${timestamp}  ${levelStr} `, message, ...optionalParams);
};

export const logger = {
  log: createLogFn('MAIN', blue),
  warn: createLogFn('WARN', yellow),
  error: createLogFn('ERROR', red),
};
