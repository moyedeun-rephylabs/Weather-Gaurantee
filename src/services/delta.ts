import type { Policy, WeatherSummary, SettlementOutcome, SettlementProof } from '../types';
import { generateFakeHash, generateUUID } from '../utils/hash';
import { formatDate } from '../utils/format';
import { delay } from './demo';

export interface PolicyParams {
  destination: Policy['destination'];
  dates: Policy['dates'];
}

// Simulate policy creation (would be a real transaction in production)
export async function createPolicy(params: PolicyParams): Promise<Policy> {
  // Simulate transaction signing delay
  await delay(1500);

  const policy: Policy = {
    id: generateUUID(),
    destination: params.destination,
    dates: params.dates,
    terms: {
      rainDaysThreshold: 2,
      premiumUSDC: 25,
      payoutUSDC: 500,
    },
    status: { type: 'pending' },
    createdAt: Date.now(),
  };

  return policy;
}

// Generate settlement proof (mocked for demo)
export async function generateSettlementProof(
  policy: Policy,
  weather: WeatherSummary
): Promise<SettlementProof> {
  // Simulate proof generation time
  await delay(2000);

  const conditionMet = weather.totalRainDays >= policy.terms.rainDaysThreshold;

  return {
    policyId: policy.id,
    proofHash: `0x${generateFakeHash(64)}`,
    constraints: [
      {
        name: 'Coverage period ended',
        verified: true,
        details: `${formatDate(policy.dates.end)} 8:00 PM`,
      },
      {
        name: 'Weather data from authorized source',
        verified: true,
        details: 'Open-Meteo Historical API',
      },
      {
        name: 'Location verified',
        verified: true,
        details: `${policy.destination.lat.toFixed(4)}°N, ${policy.destination.lng.toFixed(4)}°E`,
      },
      {
        name: 'Rain day calculation correct',
        verified: true,
        details: `${weather.totalRainDays} rain day${weather.totalRainDays !== 1 ? 's' : ''} detected`,
      },
      {
        name: 'Threshold check',
        verified: true,
        details: conditionMet
          ? `${weather.totalRainDays} ≥ ${policy.terms.rainDaysThreshold} (condition met)`
          : `${weather.totalRainDays} < ${policy.terms.rainDaysThreshold} (condition not met)`,
      },
      {
        name: 'Payout amount correct',
        verified: true,
        details: conditionMet
          ? `$${policy.terms.payoutUSDC} USDC`
          : '$0 (condition not met)',
      },
      {
        name: 'Recipient verified',
        verified: true,
        details: 'Connected wallet address',
      },
    ],
    dataSource: 'Open-Meteo Historical API (NOAA, ECMWF)',
    settlementTx: `0x${generateFakeHash(64)}`,
  };
}

// Complete settlement process
export async function settlePolicy(
  policy: Policy,
  weather: WeatherSummary
): Promise<SettlementOutcome> {
  const conditionMet = weather.totalRainDays >= policy.terms.rainDaysThreshold;
  const proof = await generateSettlementProof(policy, weather);

  return {
    conditionMet,
    rainDays: weather.totalRainDays,
    threshold: policy.terms.rainDaysThreshold,
    payoutAmount: conditionMet ? policy.terms.payoutUSDC : 0,
    weatherSummary: { ...weather, conditionMet },
    proof,
    settledAt: Date.now(),
  };
}
