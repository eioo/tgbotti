import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dayjs from 'dayjs';

export interface TrafficCamera {
  date?: Date;
  name?: string;
  imageUrl?: string;
  airTemperature?: number;
  roadTemperature?: number;
  windSpeed?: number;
}

export function validTrafficCameraUrl(url: string) {
  return /^https?:\/\/(www\.)?kelikamerat\.info\/kelikamerat\/.+?\/.+?\/tie-\d+\/.+/i.test(
    url
  );
}

export async function getTrafficCamera(
  cameraUrl: string
): Promise<TrafficCamera> {
  const { data } = await axios.get(cameraUrl);
  const $ = cheerio.load(data);

  const date = dayjs($('.date-time').text(), 'DD.MM.YYYY HH:mm:ss').toDate();
  const name = $('#page-title')
    .text()
    .trim()
    .replace('Kelikamerat - ', '');
  const imageUrl = $('img[typeof="foaf:Image"]').attr('src');
  const airTemperature = Number($('#air-temp').text());
  const roadTemperature = Number($('#road-temp').text());
  const windSpeed = Number($('#wind-speed').text());

  return {
    date,
    name,
    imageUrl,
    airTemperature,
    roadTemperature,
    windSpeed,
  };
}
