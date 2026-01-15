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

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {policy.destination.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDateRange(policy.dates.start, policy.dates.end)}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
            Monitoring
          </Badge>
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
        <div className="space-y-6">
          {conditionMet && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">
                    Condition Met
                  </p>
                  <p className="text-sm text-green-800">
                    You qualify for a <span className="font-semibold">${policy.terms.payoutUSDC} USDC</span> payout
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSettle}
            size="lg"
            className="w-full"
          >
            End Trip & Settle
          </Button>

          <p className="text-center text-xs text-gray-500">
            In production, settlement happens automatically when your trip ends
          </p>
        </div>
      )}
    </div>
  );
}
