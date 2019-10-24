const pad = (t: number) => t.toString().padStart(2, '0');
const blue = '\x1b[34m';
const reset = '\x1b[0m';

export const logger = {
  log: (message?: any, ...optionalParams: any[]) => {
    const now = new Date();

    const dateStr = [now.getDate(), pad(now.getMonth() + 1)].join('.');
    const timeStr = [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
    const timestamp = `${blue}${dateStr} ${timeStr}${reset}`;

    console.log(timestamp, message, ...optionalParams);
  },
};
