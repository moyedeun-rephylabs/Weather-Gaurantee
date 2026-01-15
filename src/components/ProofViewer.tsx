import { useState } from 'react';
import { usePolicyStore } from '../stores/policyStore';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { truncateHash } from '../utils/hash';
import { formatTimestamp } from '../utils/format';

export function ProofViewer() {
  const { policy, setScreen } = usePolicyStore();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!policy || policy.status.type !== 'settled') return null;

  const { proof } = policy.status.outcome;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setScreen('payout')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Results
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Settlement Proof
        </h1>
        <p className="text-gray-600">
          Cryptographic proof that the settlement was executed correctly
        </p>
      </div>

      {/* Policy ID */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Policy Information</h2>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500 mb-1">Policy ID</dt>
              <dd className="font-mono text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                <span>{policy.id}</span>
                <button
                  onClick={() => copyToClipboard(policy.id, 'policy')}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  {copiedHash === 'policy' ? 'Copied!' : 'Copy'}
                </button>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 mb-1">Settled At</dt>
              <dd className="text-gray-900">
                {formatTimestamp(policy.status.outcome.settledAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Proof Hash */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Proof Hash</h2>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm bg-gray-50 p-3 rounded break-all flex justify-between items-start gap-4">
            <span className="text-gray-700">{proof.proofHash}</span>
            <button
              onClick={() => copyToClipboard(proof.proofHash, 'proof')}
              className="text-blue-600 hover:text-blue-700 text-xs flex-shrink-0"
            >
              {copiedHash === 'proof' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Verified Constraints */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Verified Constraints</h2>
          <p className="text-sm text-gray-500 mt-1">
            All constraints verified cryptographically
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {proof.constraints.map((constraint, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-green-900">{constraint.name}</p>
                  <p className="text-sm text-green-700">{constraint.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Source */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Data Source</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="info">Verified</Badge>
            <span className="text-gray-700">{proof.dataSource}</span>
          </div>
        </CardContent>
      </Card>

      {/* Settlement TX */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Settlement Transaction</h2>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm bg-gray-50 p-3 rounded flex justify-between items-center">
            <span className="text-gray-700">{truncateHash(proof.settlementTx, 12)}</span>
            <button
              onClick={() => copyToClipboard(proof.settlementTx, 'tx')}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              {copiedHash === 'tx' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          onClick={() => window.alert('Explorer link would open here in production')}
        >
          Verify on Explorer
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const { lat, lng, timezone } = policy.destination;
            const { start, end } = policy.dates;
            const url = `https://open-meteo.com/en/docs/historical-weather-api#latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${end}&hourly=precipitation&timezone=${encodeURIComponent(timezone)}`;
            window.open(url, '_blank');
          }}
        >
          View Raw Weather Data
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        In production, all hashes link to verifiable on-chain data
      </p>
    </div>
  );
}
