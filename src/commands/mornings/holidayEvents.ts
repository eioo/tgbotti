import axios from 'axios';
import * as cheerio from 'cheerio';

import { sample } from '../../utils';

export interface IHolidayEvent {
  national: boolean;
  name: string;
  url: string;
  date: Date;
}

let lastCheckDate: Date;
let holidays: IHolidayEvent[] = [];

async function fetchHolidays(): Promise<IHolidayEvent[]> {
  const holidayEvents: IHolidayEvent[] = [];
  const res = await axios(
    'http://www.webcal.fi/fi-FI/popup.php?content=eventlist&cid=3'
  );
  const $ = cheerio.load(res.data);

  for (const row of Array.from($('tr'))) {
    const [day, month, year] = $(row)
      .find('td:nth-child(4)')
      .text()
      .split('.');

    holidayEvents.push({
      national: !!$(row).find('td:nth-of-type(1) img').length,
      url:
        $(row)
          .find('td:nth-of-type(2) a')
          .attr('href') || '',
      name: $(row)
        .find('td:nth-of-type(2) a')
        .text(),
      date: new Date(`${month}.${day}.${year}`),
    });
  }

  return holidayEvents;
}

export async function getTodaysHoliday(): Promise<IHolidayEvent | undefined> {
  const now = new Date();

  if (!lastCheckDate || lastCheckDate.toDateString() !== now.toDateString()) {
    holidays = await fetchHolidays();
    lastCheckDate = now;
  }

  const todaysHolidays = holidays.filter(
    x => x.date.toDateString() === now.toDateString()
  );
  const [nationalHoliday] = todaysHolidays.filter(x => x.national);

  return nationalHoliday || sample(todaysHolidays);
}
