import { useState } from 'react';
import type { Destination } from '../types';
import { usePolicyStore } from '../stores/policyStore';
import { createPolicy } from '../services/delta';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { DestinationPicker } from './DestinationPicker';
import { DateRangePicker } from './DateRangePicker';
import { formatUSDC, getDayCount } from '../utils/format';

export function PurchaseScreen() {
  const { setPolicy, setScreen } = usePolicyStore();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const canPurchase = destination && startDate && endDate && startDate <= endDate;
  const tripDays = startDate && endDate ? getDayCount(startDate, endDate) : 0;

  const handlePurchase = async () => {
    if (!destination || !startDate || !endDate) return;

    setLoading(true);
    try {
      const policy = await createPolicy({
        destination,
        dates: { start: startDate, end: endDate },
      });
      setPolicy(policy);
      setScreen('monitoring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Weather Guarantee
        </h1>
        <p className="text-gray-600">
          Get paid automatically if it rains on your trip
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Configure Your Protection
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <DestinationPicker value={destination} onChange={setDestination} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
          {tripDays > 0 && (
            <p className="text-sm text-gray-500">
              {tripDays} day trip
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Terms</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatUSDC(25)}
              </p>
              <p className="text-sm text-gray-500">Premium</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">2+ days</p>
              <p className="text-sm text-gray-500">Rain Threshold</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatUSDC(500)}
              </p>
              <p className="text-sm text-gray-500">Payout</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent>
          <h3 className="font-medium text-gray-900 mb-2">
            What counts as a rain day?
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Precipitation of 1.0mm or more per hour
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              During daytime hours (8AM - 8PM local time)
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              At least 2 qualifying hours in a day
            </li>
          </ul>
        </CardContent>
      </Card>

      <Button
        onClick={handlePurchase}
        disabled={!canPurchase}
        loading={loading}
        size="lg"
        className="w-full"
      >
        Purchase Protection for {formatUSDC(25)}
      </Button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Weather data from Open-Meteo (NOAA, ECMWF)
      </p>
    </div>
  );
}
