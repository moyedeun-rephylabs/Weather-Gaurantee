import { useEffect, useState } from 'react';
import { usePolicyStore } from '../stores/policyStore';
import { fetchWeatherData } from '../services/weather';
import { getDemoConfig, generateSimulatedWeather } from '../services/demo';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { WeatherTable } from './WeatherTable';
import { formatDateRange } from '../utils/format';
import type { DayWeather } from '../types';

export function MonitoringScreen() {
  const { policy, updateWeatherData, setScreen } = usePolicyStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherDays, setWeatherDays] = useState<DayWeather[]>([]);

  useEffect(() => {
    if (!policy) return;

    // Prevent re-fetching if already loaded
    if (policy.status.type === 'monitoring' && policy.status.weatherData.length > 0) {
      setWeatherDays(policy.status.weatherData);
      setLoading(false);
      return;
    }

    const loadWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const demoConfig = getDemoConfig();
        let summary;

        if (demoConfig.enabled) {
          // Use simulated data in demo mode
          summary = generateSimulatedWeather(
            policy.dates.start,
            policy.dates.end,
            demoConfig.rainDays
          );
        } else {
          // Fetch real weather data
          summary = await fetchWeatherData(
            policy.destination.lat,
            policy.destination.lng,
            policy.dates.start,
            policy.dates.end
          );
        }

        setWeatherDays(summary.days);
        updateWeatherData(summary.days);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [policy?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!policy) return null;

  const rainDayCount = weatherDays.filter((d) => d.isRainDay).length;
  const conditionMet = rainDayCount >= policy.terms.rainDaysThreshold;

  const handleSettle = () => {
    setScreen('settlement');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setScreen('purchase')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {policy.destination.name}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDateRange(policy.dates.start, policy.dates.end)}
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border-2 border-blue-200 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-sm"></span>
            </span>
            <span className="text-sm font-semibold text-blue-900 tracking-wide">MONITORING</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-500">Fetching weather data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Retry
              </Button>
            </div>
          ) : (
            <WeatherTable days={weatherDays} threshold={policy.terms.rainDaysThreshold} />
          )}
        </CardContent>
      </Card>

      {!loading && !error && (
        <div className="space-y-4">
          {conditionMet && (
            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full -ml-12 -mb-12 opacity-30"></div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-900 mb-1">
                    Condition Met!
                  </p>
                  <p className="text-green-800 font-medium">
                    You qualify for a{' '}
                    <span className="text-2xl font-bold text-green-900">${policy.terms.payoutUSDC} USDC</span>{' '}
                    payout
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSettle}
            size="lg"
            className="w-full relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              End Trip & Settle
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Button>

          <p className="text-center text-xs text-gray-400">
            In production, settlement happens automatically when your trip ends
          </p>
        </div>
      )}
    </div>
  );
}
