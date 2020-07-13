const durationRegex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-z]+)/gi;
const dateRegex = /([1-9]|0[1-9]|[12][0-9]|3[01])[-.]([1-9]|0[1-9]|1[012])[-.]((19|20)\d\d)?/g;
const timeRegex = /\d{1,2}:\d{2}:?(\d+)?/g;

const ratios: Record<string, number> = {};

ratios.second = ratios.sec = ratios.s = 1000;
ratios.minute = ratios.min = ratios.m = ratios.s * 60;
ratios.hour = ratios.hr = ratios.h = ratios.m * 60;
ratios.day = ratios.d = ratios.h * 24;
ratios.week = ratios.wk = ratios.w = ratios.d * 7;
ratios.b = ratios.month = ratios.d * (365.25 / 12);
ratios.year = ratios.yr = ratios.y = ratios.d * 365.25;

export function parseDuration(str: string) {
  if (!durationRegex.test(str)) {
    return;
  }

  let result = 0;
  str = str.replace(/(\d),(\d)/g, '$1$2');

  str.replace(durationRegex, (_, n, units) => {
    units = ratios[units] || ratios[units.toLowerCase().replace(/s$/, '')];

    if (units) {
      result += parseFloat(n) * units;
    }

    return '';
  });

  return result;
}

export function parseDate(str: string) {
  if (!dateRegex.test(str)) {
    return;
  }

  const matches = str.match(dateRegex);

  if (!matches) {
    return;
  }

  try {
    const [days, months, years] = matches[0].split(/[.-]/g).map(x => Number(x));
    const now = new Date();

    return {
      days: days || now.getDate(),
      months: months ? months - 1 : now.getMonth(),
      years: years || now.getFullYear(),
    };
  } catch {
    return;
  }
}

export function parseTime(str: string) {
  if (!timeRegex.test(str)) {
    return;
  }

  const matches = str.match(timeRegex);

  if (!matches) {
    return;
  }

  try {
    const [hours, minutes, seconds] = matches[0].split(':').map(Number);

    return {
      hours,
      minutes,
      seconds: seconds || 0,
    };
  } catch {
    return;
  }
}

export function parseReminder(str: string) {
  const duration = parseDuration(str);

  if (duration) {
    return {
      date: new Date(Date.now() + duration),
      text: str.replace(durationRegex, '').trim(),
    };
  }

  const parsedDate = parseDate(str);
  const parsedTime = parseTime(str);

  if (!parsedDate && !parsedTime) {
    return;
  }

  const date = new Date();

  if (parsedDate) {
    date.setDate(parsedDate.days);
    date.setMonth(parsedDate.months);
    date.setFullYear(parsedDate.years);
    str = str.replace(dateRegex, '');
  }

  if (parsedTime) {
    date.setSeconds(parsedTime.seconds);
    date.setMinutes(parsedTime.minutes);
    date.setHours(parsedTime.hours);
    str = str.replace(timeRegex, '');
  }

  return {
    date,
    text: str.trim(),
  };
}
