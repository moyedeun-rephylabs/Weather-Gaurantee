import type { DemoConfig, WeatherSummary, DayWeather } from '../types';

// Parse demo config from URL params
export function getDemoConfig(): DemoConfig {
  const params = new URLSearchParams(window.location.search);

  return {
    enabled: params.get('demo') === 'true',
    rainDays: params.has('rain_days') ? parseInt(params.get('rain_days')!, 10) : undefined,
    outcome: params.get('outcome') as 'payout' | 'no-payout' | undefined,
    speed: params.get('speed') === 'fast' ? 'fast' : 'normal',
  };
}

// Generate simulated weather data for demo mode
export function generateSimulatedWeather(
  startDate: string,
  endDate: string,
  forcedRainDays?: number
): WeatherSummary {
  const days: DayWeather[] = [];
  let currentDate = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  // Determine which days should be rain days
  const totalDays: string[] = [];
  while (currentDate <= end) {
    totalDays.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // If forced rain days specified, select random days to be rainy
  const rainDayIndices = new Set<number>();
  const targetRainDays = forcedRainDays ?? Math.floor(Math.random() * (totalDays.length + 1));

  while (rainDayIndices.size < Math.min(targetRainDays, totalDays.length)) {
    rainDayIndices.add(Math.floor(Math.random() * totalDays.length));
  }

  // Generate weather for each day
  totalDays.forEach((dateStr, index) => {
    const isRainDay = rainDayIndices.has(index);
    const hourlyPrecipitation = new Array(24).fill(0);

    if (isRainDay) {
      // Generate 2-4 hours of heavy rain between 8AM-8PM
      const rainHours = 2 + Math.floor(Math.random() * 3);
      const startHour = 8 + Math.floor(Math.random() * (12 - rainHours));
      for (let i = 0; i < rainHours; i++) {
        hourlyPrecipitation[startHour + i] = 1.0 + Math.random() * 5;
      }
    } else {
      // Maybe some light precipitation
      if (Math.random() < 0.3) {
        const hour = 8 + Math.floor(Math.random() * 12);
        hourlyPrecipitation[hour] = Math.random() * 0.9;
      }
    }

    const qualifyingHours = hourlyPrecipitation
      .slice(8, 20)
      .filter(p => p >= 1.0).length;

    days.push({
      date: dateStr,
      hourlyPrecipitation,
      qualifyingHours,
      isRainDay: qualifyingHours >= 2,
    });
  });

  const totalRainDays = days.filter(d => d.isRainDay).length;

  return {
    days,
    totalRainDays,
    conditionMet: false,
  };
}

// Get animation delay multiplier based on demo speed
export function getDelayMultiplier(): number {
  const config = getDemoConfig();
  return config.speed === 'fast' ? 0.5 : 1;
}

// Helper for delays with demo speed consideration
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms * getDelayMultiplier()));
}
