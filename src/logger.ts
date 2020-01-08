import * as dateFormat from 'dateformat';

const blue = '\x1b[34m';
const reset = '\x1b[0m';

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (message?: any, ...optionalParams: any[]) => {
    const timestamp = dateFormat('dd.mm. HH:MM:ss.l');
    console.log(`${blue}${timestamp}${reset}`, message, ...optionalParams);
  },
};
