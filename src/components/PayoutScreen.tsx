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
    <div className="max-w-3xl mx-auto relative">
      {/* Confetti Effect (CSS-only) */}
      {conditionMet && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][i % 4],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <Card className="mb-6 overflow-hidden shadow-lg">
        <div
          className={`p-8 text-center relative ${
            conditionMet
              ? 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600'
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          }`}
        >
          {conditionMet ? (
            <>
              <div className="text-7xl font-bold mb-3 text-white tracking-tight drop-shadow-lg">
                $500.00
              </div>
              <p className="text-xl text-white/95 font-semibold tracking-wide">
                USDC deposited to your wallet
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl text-white mb-4 font-semibold">Weather condition not met</div>
              <p className="text-lg text-white/80">
                Your ${policy.terms.premiumUSDC} premium stays in the pool
              </p>
            </>
          )}
        </div>
        <CardContent className="py-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex justify-center gap-3 flex-wrap">
            {conditionMet && (
              <>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-600 text-white shadow-md">
                  ⚡ Automatic
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-600 text-white shadow-md">
                  🚀 Instant
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-purple-600 text-white shadow-md">
                  ✓ Verifiable
                </span>
              </>
            )}
            {!conditionMet && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gray-600 text-white shadow-md">
                Settlement Complete
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>

      {/* Trip Summary */}
      <Card className="mb-6 shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-xl">📍</span>
                {policy.destination.name}
              </h2>
              <p className="text-sm text-gray-500 ml-7">
                {formatDateRange(policy.dates.start, policy.dates.end)}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
              conditionMet
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-white'
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

      {/* Outcome Details */}
      <Card className="mb-6 shadow-md border-l-4 border-l-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Settlement Details
          </h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
              <dt className="text-sm font-medium text-amber-700 flex items-center gap-1.5 mb-1">
                <span>💰</span>
                Premium Paid
              </dt>
              <dd className="text-2xl font-bold text-amber-900">
                {formatUSDC(policy.terms.premiumUSDC)}
              </dd>
            </div>
            <div className={`p-4 rounded-lg border ${
              conditionMet
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
            }`}>
              <dt className={`text-sm font-medium flex items-center gap-1.5 mb-1 ${
                conditionMet ? 'text-green-700' : 'text-gray-700'
              }`}>
                <span>{conditionMet ? '✅' : '📭'}</span>
                Payout Received
              </dt>
              <dd className={`text-2xl font-bold ${
                conditionMet ? 'text-green-900' : 'text-gray-900'
              }`}>
                {formatUSDC(payoutAmount)}
              </dd>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
              <dt className="text-sm font-medium text-blue-700 flex items-center gap-1.5 mb-1">
                <span>🎯</span>
                Rain Days Required
              </dt>
              <dd className="text-2xl font-bold text-blue-900">
                {outcome.threshold}+ days
              </dd>
            </div>
            <div className={`p-4 rounded-lg border ${
              outcome.rainDays >= outcome.threshold
                ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
                : 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200'
            }`}>
              <dt className={`text-sm font-medium flex items-center gap-1.5 mb-1 ${
                outcome.rainDays >= outcome.threshold ? 'text-purple-700' : 'text-slate-700'
              }`}>
                <span>🌧️</span>
                Actual Rain Days
              </dt>
              <dd className={`text-2xl font-bold ${
                outcome.rainDays >= outcome.threshold ? 'text-purple-900' : 'text-slate-900'
              }`}>
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
        <div className="mt-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-10 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-center shadow-2xl border border-blue-400/20">
            <div className="text-4xl mb-4 opacity-50">✨</div>
            <blockquote className="space-y-3">
              <p className="text-2xl font-bold text-white leading-relaxed tracking-tight">
                "If it rains, you get paid"
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
              <p className="text-lg text-blue-100 font-medium">
                is not a promise from a company.
              </p>
              <p className="text-xl text-white font-semibold">
                It's a physical law of the system.
              </p>
            </blockquote>
            <div className="mt-6 text-xs text-blue-300/60 uppercase tracking-widest font-semibold">
              Powered by Delta Cryptographic Guarantees
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
