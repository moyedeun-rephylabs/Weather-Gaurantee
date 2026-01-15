import { usePolicyStore } from '../stores/policyStore';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { WeatherTable } from './WeatherTable';
import { formatUSDC, formatDateRange } from '../utils/format';

export function PayoutScreen() {
  const { policy, setScreen, reset } = usePolicyStore();

  if (!policy || policy.status.type !== 'settled') return null;

  const { outcome } = policy.status;
  const { conditionMet, payoutAmount, weatherSummary } = outcome;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Section */}
      <Card className="mb-12 overflow-hidden border border-gray-200">
        <div
          className={`py-16 px-8 text-center ${
            conditionMet ? 'bg-green-600' : 'bg-gray-100'
          }`}
        >
          {conditionMet ? (
            <>
              <div className="text-6xl font-semibold mb-4 text-white tracking-tight">
                $500.00
              </div>
              <p className="text-lg text-white/90">
                USDC deposited to your wallet
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl text-gray-900 mb-3 font-medium">Weather condition not met</div>
              <p className="text-base text-gray-600">
                Your ${policy.terms.premiumUSDC} premium stays in the pool
              </p>
            </>
          )}
        </div>
        {conditionMet && (
          <CardContent className="py-5 bg-white border-t border-gray-200">
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <span>Automatic</span>
              <span className="text-gray-300">•</span>
              <span>Instant</span>
              <span className="text-gray-300">•</span>
              <span>Verifiable</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Trip Summary */}
      <Card className="mb-8 border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-medium text-gray-900">
                {policy.destination.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {formatDateRange(policy.dates.start, policy.dates.end)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-medium ${
              conditionMet
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {outcome.rainDays} of {outcome.threshold} rain days
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <WeatherTable
            days={weatherSummary.days}
            threshold={policy.terms.rainDaysThreshold}
          />
        </CardContent>
      </Card>

      {/* Settlement Details */}
      <Card className="mb-8 border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">
            Settlement Details
          </h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <dt className="text-sm text-gray-500">
                Premium Paid
              </dt>
              <dd className="text-2xl font-medium text-gray-900">
                {formatUSDC(policy.terms.premiumUSDC)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm text-gray-500">
                Payout Received
              </dt>
              <dd className={`text-2xl font-medium ${
                conditionMet ? 'text-green-600' : 'text-gray-900'
              }`}>
                {formatUSDC(payoutAmount)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm text-gray-500">
                Rain Days Required
              </dt>
              <dd className="text-2xl font-medium text-gray-900">
                {outcome.threshold}+ days
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm text-gray-500">
                Actual Rain Days
              </dt>
              <dd className="text-2xl font-medium text-gray-900">
                {outcome.rainDays} days
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3 mb-12">
        <Button
          onClick={() => setScreen('proof')}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          View Cryptographic Proof
        </Button>
        <Button
          onClick={reset}
          variant="ghost"
          size="lg"
          className="w-full"
        >
          Start New Protection
        </Button>
      </div>

      {/* Key Message */}
      {conditionMet && (
        <div className="mt-16 mb-8">
          <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
            <blockquote className="space-y-4">
              <p className="text-xl font-medium text-gray-900">
                "If it rains, you get paid"
              </p>
              <p className="text-base text-gray-600">
                is not a promise from a company.
              </p>
              <p className="text-base text-gray-900">
                It's a physical law of the system.
              </p>
            </blockquote>
            <div className="mt-8 text-xs text-gray-400 uppercase tracking-wide font-medium">
              Powered by Delta Cryptographic Guarantees
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
