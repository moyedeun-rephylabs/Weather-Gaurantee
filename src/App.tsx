import { usePolicyStore } from './stores/policyStore';
import { PurchaseScreen } from './components/PurchaseScreen';
import { MonitoringScreen } from './components/MonitoringScreen';
import { SettlementScreen } from './components/SettlementScreen';
import { PayoutScreen } from './components/PayoutScreen';
import { ProofViewer } from './components/ProofViewer';
import { getDemoConfig } from './services/demo';

function DemoBanner() {
  const config = getDemoConfig();
  if (!config.enabled) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
      Demo Mode Active
      {config.rainDays !== undefined && ` • Forced rain days: ${config.rainDays}`}
      {config.speed === 'fast' && ' • 2x Speed'}
    </div>
  );
}

function ResetButton() {
  const { policy, reset } = usePolicyStore();
  if (!policy) return null;

  return (
    <button
      onClick={reset}
      className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-lg"
    >
      Reset Demo
    </button>
  );
}

export default function App() {
  const { currentScreen } = usePolicyStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoBanner />

      <main className="container mx-auto px-4 py-8">
        {currentScreen === 'purchase' && <PurchaseScreen />}
        {currentScreen === 'monitoring' && <MonitoringScreen />}
        {currentScreen === 'settlement' && <SettlementScreen />}
        {currentScreen === 'payout' && <PayoutScreen />}
        {currentScreen === 'proof' && <ProofViewer />}
      </main>

      <ResetButton />
    </div>
  );
}
