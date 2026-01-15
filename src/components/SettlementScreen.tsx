import { useEffect, useState } from 'react';
import { usePolicyStore } from '../stores/policyStore';
import { settlePolicy } from '../services/delta';
import { delay } from '../services/demo';
import { Card, CardContent } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface SettlementStep {
  label: string;
  status: 'pending' | 'in_progress' | 'complete';
}

const INITIAL_STEPS: SettlementStep[] = [
  { label: 'Fetching final weather data...', status: 'pending' },
  { label: 'Verifying rain day calculation...', status: 'pending' },
  { label: 'Generating settlement proof...', status: 'pending' },
  { label: 'Submitting to Delta...', status: 'pending' },
  { label: 'Settlement confirmed!', status: 'pending' },
];

export function SettlementScreen() {
  const { policy, startSettlement, completeSettlement, setScreen } = usePolicyStore();
  const [steps, setSteps] = useState<SettlementStep[]>(INITIAL_STEPS);
  const [, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!policy) return;

    startSettlement();

    const runSettlement = async () => {
      // Get weather data from policy status
      const weatherData =
        policy.status.type === 'monitoring'
          ? policy.status.weatherData
          : policy.status.type === 'settling' && 'weatherData' in policy.status
            ? []
            : [];

      const weatherSummary = {
        days: weatherData,
        totalRainDays: weatherData.filter((d) => d.isRainDay).length,
        conditionMet: false,
      };

      // Animate through steps
      for (let i = 0; i < INITIAL_STEPS.length; i++) {
        setCurrentStep(i);
        setSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx < i ? 'complete' : idx === i ? 'in_progress' : 'pending',
          }))
        );

        // Pause between steps for dramatic effect
        if (i < INITIAL_STEPS.length - 1) {
          await delay(1500);
        }
      }

      // Actually settle
      const outcome = await settlePolicy(policy, weatherSummary);

      // Mark final step complete
      setSteps((prev) =>
        prev.map((step) => ({ ...step, status: 'complete' as const }))
      );

      await delay(500);

      completeSettlement(outcome);
      setScreen('payout');
    };

    runSettlement();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="py-12">
          <div className="text-center mb-8">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              Settling Your Policy
            </h2>
            <p className="text-gray-500 mt-1">
              Generating cryptographic proof...
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.status === 'in_progress'
                    ? 'bg-blue-50'
                    : step.status === 'complete'
                      ? 'bg-green-50'
                      : 'bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.status === 'complete' ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : step.status === 'in_progress' ? (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    step.status === 'complete'
                      ? 'text-green-800'
                      : step.status === 'in_progress'
                        ? 'text-blue-800 font-medium'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
