import type { WeatherSummary, OpenMeteoResponse } from '../types';
import { processWeatherData } from '../utils/weather';

export async function fetchWeatherData(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string
): Promise<WeatherSummary> {
  const url = new URL('https://archive-api.open-meteo.com/v1/archive');
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lng.toString());
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);
  url.searchParams.set('hourly', 'precipitation');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();
  return processWeatherData(data, startDate, endDate);
}
