import axios from 'axios';
import * as cheerio from 'cheerio';
import { isSameDay } from 'date-fns';
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
  const res = await axios(
    'http://www.webcal.fi/fi-FI/popup.php?content=eventlist&cid=3'
  );
  const $ = cheerio.load(res.data);

  return Array.from($('tr')).map(row => {
    const [day, month, year] = $(row)
      .find('td:nth-child(4)')
      .text()
      .split('.')
      .map(Number);

    const national = !!$(row).find('td:nth-of-type(1) img').length;
    const url =
      $(row)
        .find('td:nth-of-type(2) a')
        .attr('href') || '';
    const name = $(row)
      .find('td:nth-of-type(2) a')
      .text();
    const date = new Date(year, month, day);

    return {
      national,
      url,
      name,
      date,
    };
  });
}

export async function getTodaysHoliday(): Promise<IHolidayEvent | undefined> {
  const now = new Date();

  if (!lastCheckDate || isSameDay(lastCheckDate, now)) {
    holidays = await fetchHolidays();
    lastCheckDate = now;
  }

  const todaysHolidays = holidays.filter(event => isSameDay(event.date, now));
  const [nationalHoliday] = todaysHolidays.filter(x => x.national);
  return nationalHoliday || sample(todaysHolidays);
}
