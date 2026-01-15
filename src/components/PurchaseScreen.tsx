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
      {/* Clean minimal header */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Weather Guarantee
        </h1>
        <p className="text-gray-500">
          Get paid automatically if it rains on your trip
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-sm font-medium text-gray-900">
            Configure Your Protection
          </h2>
        </CardHeader>
        <CardContent className="space-y-5">
          <DestinationPicker value={destination} onChange={setDestination} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
          {tripDays > 0 && (
            <div className="text-sm text-gray-500">
              {tripDays} day trip
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-sm font-medium text-gray-900">Terms</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* Premium */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                {formatUSDC(25)}
              </p>
              <p className="text-xs text-gray-500">Premium</p>
            </div>
            {/* Threshold */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-semibold text-gray-900 mb-1">2+ days</p>
              <p className="text-xs text-gray-500">Rain Threshold</p>
            </div>
            {/* Payout */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                {formatUSDC(500)}
              </p>
              <p className="text-xs text-gray-500">Payout</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="py-5">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            What counts as a rain day?
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="text-sm text-gray-600">
                Precipitation of <span className="font-medium text-gray-900">1.0mm or more</span> per hour
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="text-sm text-gray-600">
                During daytime hours <span className="font-medium text-gray-900">(8AM - 8PM local time)</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="text-sm text-gray-600">
                At least <span className="font-medium text-gray-900">2 qualifying hours</span> in a day
              </span>
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
