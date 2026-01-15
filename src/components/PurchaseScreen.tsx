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
      {/* Premium header with gradient background */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl -z-10 transform -rotate-1"></div>
        <div className="bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl px-8 py-10 backdrop-blur-sm">
          {/* Umbrella icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg shadow-blue-500/20">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10c0-3.866 3.134-7 7-7s7 3.134 7 7m-7 7v-3m0 0a3 3 0 01-3-3m3 3a3 3 0 003-3m0 0V7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3">
            Weather Guarantee
          </h1>
          <p className="text-gray-600 text-lg">
            Get paid automatically if it rains on your trip
          </p>
        </div>
      </div>

      <Card className="mb-6 border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
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
            <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-blue-900">
                {tripDays} day trip
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6 border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900">Terms</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Premium Card */}
            <div className="group relative p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-400/0 to-slate-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-3xl font-bold text-slate-900 mb-1.5 relative">
                {formatUSDC(25)}
              </p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide relative">Premium</p>
            </div>
            {/* Threshold Card */}
            <div className="group relative p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1.5 relative">2+ days</p>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide relative">Rain Threshold</p>
            </div>
            {/* Payout Card */}
            <div className="group relative p-5 bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-green-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1.5 relative">
                {formatUSDC(500)}
              </p>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide relative">Payout</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 border-0 shadow-sm bg-gradient-to-br from-slate-50/50 to-white">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-base">
              What counts as a rain day?
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 group">
              <div className="flex-shrink-0 mt-0.5 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                Precipitation of <span className="font-medium text-gray-900">1.0mm or more</span> per hour
              </span>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="flex-shrink-0 mt-0.5 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                During daytime hours <span className="font-medium text-gray-900">(8AM - 8PM local time)</span>
              </span>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="flex-shrink-0 mt-0.5 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
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
