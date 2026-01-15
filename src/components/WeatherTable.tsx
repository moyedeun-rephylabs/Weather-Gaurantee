import type { DayWeather } from '../types';
import { formatDate } from '../utils/format';
import { getWeatherIcon, getDayPrecipitation } from '../utils/weather';

interface WeatherTableProps {
  days: DayWeather[];
  threshold?: number;
}

function WeatherIcon({ type }: { type: 'sun' | 'cloud' | 'rain' }) {
  if (type === 'sun') {
    return (
      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (type === 'cloud') {
    return (
      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
      <path
        fillRule="evenodd"
        d="M7 13a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3 0a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3 0a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function WeatherTable({ days, threshold = 2 }: WeatherTableProps) {
  const rainDayCount = days.filter((d) => d.isRainDay).length;

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Weather
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Rain Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Precip (8AM-8PM)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">
                Rain Day
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {days.map((day) => (
              <tr
                key={day.date}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(day.date)}
                </td>
                <td className="px-4 py-4">
                  <WeatherIcon type={getWeatherIcon(day)} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm text-gray-900">{day.qualifyingHours}</span>
                    <span className="text-xs text-gray-500">hr{day.qualifyingHours !== 1 ? 's' : ''} ≥1mm</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">
                    {getDayPrecipitation(day).toFixed(1)}mm
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {day.isRainDay ? (
                    <svg className="w-4 h-4 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-4 border border-gray-200 rounded-lg bg-gray-50">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Rain Days</p>
          <p className="text-sm text-gray-900">
            <span className="font-semibold">{rainDayCount}</span> of {threshold} needed
          </p>
        </div>
        {rainDayCount >= threshold ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-md">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Condition Met
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            {threshold - rainDayCount} more needed
          </span>
        )}
      </div>
    </div>
  );
}
