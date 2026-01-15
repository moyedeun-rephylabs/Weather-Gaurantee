// Destination configuration
export interface Destination {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

// Policy types
export interface Policy {
  id: string;
  destination: Destination;
  dates: {
    start: string; // YYYY-MM-DD
    end: string;
  };
  terms: {
    rainDaysThreshold: number;
    premiumUSDC: number;
    payoutUSDC: number;
  };
  status: PolicyStatus;
  createdAt: number;
}

export type PolicyStatus =
  | { type: 'pending' }
  | { type: 'monitoring'; weatherData: DayWeather[] }
  | { type: 'settling' }
  | { type: 'settled'; outcome: SettlementOutcome };

// Weather types
export interface DayWeather {
  date: string;
  hourlyPrecipitation: number[]; // 24 values (mm per hour)
  qualifyingHours: number; // Count of hours >= 1.0mm between 8AM-8PM
  isRainDay: boolean; // qualifyingHours >= 2
}

export interface WeatherSummary {
  days: DayWeather[];
  totalRainDays: number;
  conditionMet: boolean;
}

// Settlement types
export interface SettlementOutcome {
  conditionMet: boolean;
  rainDays: number;
  threshold: number;
  payoutAmount: number;
  weatherSummary: WeatherSummary;
  proof: SettlementProof;
  settledAt: number;
}

export interface SettlementProof {
  policyId: string;
  proofHash: string;
  constraints: ProofConstraint[];
  dataSource: string;
  settlementTx: string;
}

export interface ProofConstraint {
  name: string;
  verified: boolean;
  details: string;
}

// Open-Meteo API response
export interface OpenMeteoResponse {
  hourly: {
    time: string[];
    precipitation: number[];
  };
}

// Demo mode config
export interface DemoConfig {
  enabled: boolean;
  rainDays?: number;
  outcome?: 'payout' | 'no-payout';
  speed: 'normal' | 'fast';
}

// App screen states
export type Screen = 'purchase' | 'monitoring' | 'settlement' | 'payout' | 'proof';
