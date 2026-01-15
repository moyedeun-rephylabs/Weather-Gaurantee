# Weather Guarantee Demo

A demo application showing how weather insurance could work with cryptographic guarantees. Built to illustrate the concept of automatic, verifiable payouts - "if it rains, you get paid" becomes a physical law of the system, not a promise from a company.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

1. **Purchase Protection** - Select a destination and travel dates, pay $25 premium
2. **Weather Monitoring** - System tracks weather data during your trip
3. **Automatic Settlement** - If conditions are met, $500 payout happens automatically
4. **Verifiable Proof** - Cryptographic proof shows exactly how the decision was made

## Rain Day Criteria

A day qualifies as a "rain day" when:

| Criteria | Value |
|----------|-------|
| Time window | 8AM - 8PM local time |
| Precipitation threshold | ≥ 1.0mm per hour |
| Required hours | At least 2 qualifying hours |

**Payout triggers when 2+ rain days occur during the trip.**

## Demo Mode

For presentations with predictable outcomes, use URL parameters:

```
http://localhost:5173/?demo=true&rain_days=3
```

| Parameter | Description |
|-----------|-------------|
| `demo=true` | Enable demo mode (uses simulated weather data) |
| `rain_days=N` | Force exactly N rain days |
| `outcome=payout` | Force payout outcome |
| `speed=fast` | 2x animation speed |

**Without demo mode**, the app fetches real historical weather data from Open-Meteo API. Make sure to select **past dates** (the archive API only has historical data).

## Preset Destinations

- Hong Kong Disneyland
- Tokyo Disney Resort
- Universal Studios Singapore
- Sydney Opera House

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Open-Meteo API (weather data)

## Project Structure

```
src/
├── components/
│   ├── PurchaseScreen.tsx    # Trip configuration & purchase
│   ├── MonitoringScreen.tsx  # Weather tracking display
│   ├── SettlementScreen.tsx  # Proof generation animation
│   ├── PayoutScreen.tsx      # Outcome display
│   ├── ProofViewer.tsx       # Cryptographic proof details
│   ├── WeatherTable.tsx      # Day-by-day weather breakdown
│   └── ui/                   # Reusable components
├── services/
│   ├── weather.ts            # Open-Meteo API integration
│   ├── delta.ts              # Mocked Delta SDK
│   └── demo.ts               # Demo mode utilities
├── stores/
│   └── policyStore.ts        # Zustand state management
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/
    ├── weather.ts            # Rain day calculation
    ├── format.ts             # Date/currency formatting
    └── hash.ts               # Fake hash generation
```

## Note

This is a **demo application**. The Delta integration (proof generation, settlement) is mocked. In production:

- Weather data would be fetched and signed by a domain server
- Real ZK proofs would be generated via Delta SDK
- Actual USDC transfers would occur on the Delta ledger

The UI/UX would remain identical - the difference is that everything becomes cryptographically enforced.
