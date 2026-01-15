import { usePolicyStore } from '../stores/policyStore';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
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
      <Card className="mb-6 overflow-hidden">
        <div
          className={`p-8 text-center ${
            conditionMet
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          }`}
        >
          {conditionMet ? (
            <>
              <div className="text-6xl mb-4">$500.00</div>
              <p className="text-xl text-white/90 font-medium">
                USDC deposited to your wallet
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl text-white mb-4">Weather condition not met</div>
              <p className="text-lg text-white/80">
                Your ${policy.terms.premiumUSDC} premium stays in the pool
              </p>
            </>
          )}
        </div>
        <CardContent className="py-6">
          <div className="flex justify-center gap-3">
            {conditionMet && (
              <>
                <Badge variant="success">Automatic</Badge>
                <Badge variant="info">Instant</Badge>
                <Badge variant="default">Verifiable</Badge>
              </>
            )}
            {!conditionMet && (
              <Badge variant="default">Settlement Complete</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trip Summary */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {policy.destination.name}
              </h2>
              <p className="text-sm text-gray-500">
                {formatDateRange(policy.dates.start, policy.dates.end)}
              </p>
            </div>
            <Badge variant={conditionMet ? 'success' : 'default'}>
              {outcome.rainDays} of {outcome.threshold} rain days
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <WeatherTable
            days={weatherSummary.days}
            threshold={policy.terms.rainDaysThreshold}
          />
        </CardContent>
      </Card>

      {/* Outcome Details */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Settlement Details</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Premium Paid</dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatUSDC(policy.terms.premiumUSDC)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Payout Received</dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatUSDC(payoutAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Rain Days Required</dt>
              <dd className="text-lg font-medium text-gray-900">
                {outcome.threshold}+ days
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Actual Rain Days</dt>
              <dd className="text-lg font-medium text-gray-900">
                {outcome.rainDays} days
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
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
        <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
          <p className="text-blue-900 font-medium">
            "If it rains, you get paid" is not a promise from a company.
          </p>
          <p className="text-blue-700 mt-1">
            It's a physical law of the system.
          </p>
        </div>
      )}
    </div>
  );
}
