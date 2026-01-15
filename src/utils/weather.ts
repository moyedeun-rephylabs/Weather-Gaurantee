import type { DayWeather, WeatherSummary, OpenMeteoResponse } from '../types';

// Process raw Open-Meteo response into our weather summary
export function processWeatherData(
  raw: OpenMeteoResponse,
  startDate: string,
  endDate: string
): WeatherSummary {
  const days: DayWeather[] = [];

  // Group hourly data by date
  const hoursByDate = new Map<string, number[]>();

  raw.hourly.time.forEach((timeStr, index) => {
    const date = timeStr.split('T')[0];
    if (!hoursByDate.has(date)) {
      hoursByDate.set(date, new Array(24).fill(0));
    }
    const hour = parseInt(timeStr.split('T')[1].split(':')[0], 10);
    hoursByDate.get(date)![hour] = raw.hourly.precipitation[index] || 0;
  });

  // Filter to only requested date range and process each day
  let currentDate = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hourlyPrecipitation = hoursByDate.get(dateStr) || new Array(24).fill(0);

    // Count qualifying hours (8AM-8PM, >= 1.0mm)
    let qualifyingHours = 0;
    for (let hour = 8; hour < 20; hour++) {
      if (hourlyPrecipitation[hour] >= 1.0) {
        qualifyingHours++;
      }
    }

    days.push({
      date: dateStr,
      hourlyPrecipitation,
      qualifyingHours,
      isRainDay: qualifyingHours >= 2,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalRainDays = days.filter(d => d.isRainDay).length;

  return {
    days,
    totalRainDays,
    conditionMet: false, // Will be set based on threshold
  };
}

// Calculate total precipitation for a day (8AM-8PM only)
export function getDayPrecipitation(day: DayWeather): number {
  let total = 0;
  for (let hour = 8; hour < 20; hour++) {
    total += day.hourlyPrecipitation[hour] || 0;
  }
  return total;
}

// Get weather icon based on precipitation
export function getWeatherIcon(day: DayWeather): 'sun' | 'cloud' | 'rain' {
  const totalPrecip = getDayPrecipitation(day);
  if (day.isRainDay) return 'rain';
  if (totalPrecip > 0) return 'cloud';
  return 'sun';
}
