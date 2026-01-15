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
      <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-full">
        <svg className="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  if (type === 'cloud') {
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full">
        <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
      <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        <path
          fillRule="evenodd"
          d="M7 13a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3 0a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3 0a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export function WeatherTable({ days, threshold = 2 }: WeatherTableProps) {
  const rainDayCount = days.filter((d) => d.isRainDay).length;

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Weather
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Rain Hours
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Precip (8AM-8PM)
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Rain Day?
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {days.map((day) => (
            <tr
              key={day.date}
              className={`
                transition-all duration-200
                ${day.isRainDay
                  ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-400'
                  : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent hover:border-l-gray-300'
                }
              `}
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {formatDate(day.date)}
              </td>
              <td className="px-4 py-4">
                <WeatherIcon type={getWeatherIcon(day)} />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{day.qualifyingHours}</span>
                  <span className="text-xs text-gray-500">hour{day.qualifyingHours !== 1 ? 's' : ''} {'≥'} 1mm</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {getDayPrecipitation(day).toFixed(1)}mm
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                {day.isRainDay ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 rounded-full shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 px-5 py-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                <path
                  fillRule="evenodd"
                  d="M7 13a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3 0a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm3 0a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Rain Days</p>
              <p className="text-lg font-bold text-gray-900">
                <span className="text-blue-600">{rainDayCount}</span> of {threshold} needed
              </p>
            </div>
          </div>
          {rainDayCount >= threshold ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Condition Met
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {threshold - rainDayCount} more needed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
