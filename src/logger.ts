const pad = (t: number, length = 2) => t.toString().padStart(length, '0');
const blue = '\x1b[34m';
const reset = '\x1b[0m';

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (message?: any, ...optionalParams: any[]) => {
    const now = new Date();

    const dateStr = [pad(now.getDate()), pad(now.getMonth() + 1)].join('.');
    const timeStr = `${[
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':')}.${pad(now.getMilliseconds(), 3)}`;

    const timestamp = `${blue}${dateStr} ${timeStr}${reset}`;

    console.log(timestamp, message, ...optionalParams);
  },
};
