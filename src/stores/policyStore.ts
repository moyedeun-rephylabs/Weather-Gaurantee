import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Policy, Screen, DayWeather, SettlementOutcome } from '../types';

interface PolicyStore {
  // State
  policy: Policy | null;
  currentScreen: Screen;

  // Actions
  setPolicy: (policy: Policy) => void;
  setScreen: (screen: Screen) => void;
  updateWeatherData: (data: DayWeather[]) => void;
  startSettlement: () => void;
  completeSettlement: (outcome: SettlementOutcome) => void;
  reset: () => void;
}

export const usePolicyStore = create<PolicyStore>()(
  persist(
    (set) => ({
      policy: null,
      currentScreen: 'purchase',

      setPolicy: (policy) => set({ policy }),

      setScreen: (screen) => set({ currentScreen: screen }),

      updateWeatherData: (data) =>
        set((state) => {
          if (!state.policy) return state;
          return {
            policy: {
              ...state.policy,
              status: { type: 'monitoring', weatherData: data },
            },
          };
        }),

      startSettlement: () =>
        set((state) => {
          if (!state.policy) return state;
          return {
            policy: {
              ...state.policy,
              status: { type: 'settling' },
            },
          };
        }),

      completeSettlement: (outcome) =>
        set((state) => {
          if (!state.policy) return state;
          return {
            policy: {
              ...state.policy,
              status: { type: 'settled', outcome },
            },
          };
        }),

      reset: () => set({ policy: null, currentScreen: 'purchase' }),
    }),
    {
      name: 'weather-guarantee-policy',
    }
  )
);
