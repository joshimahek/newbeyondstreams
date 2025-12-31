import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SignalKey =
  | 'analytical'
  | 'creative'
  | 'social'
  | 'structured'
  | 'exploratory'
  | 'practical';

export type ExplorationState = {
  intent?: 'pivot' | 'growth' | 'explore' | 'curious';
  
  context: {
    workProximity?: string[];
    constraints?: string[];
  };
  
  signals: Record<SignalKey, number>;
  
  // Behavioral biases from games
  behavioralBias: {
    executionBias: number;
    empathyBias: number;
  };
  
  // Decision style metadata
  decisionStyle?: {
    riskTolerance?: 'low' | 'medium-low' | 'medium-high' | 'high';
    authorityBias?: 'low' | 'medium' | 'high';
    decisionMode?: 'intuition-led' | 'data-driven' | 'experience-driven' | 'action-biased';
  };
  
  normalizedSignals?: Record<SignalKey, number>;
  
  completedSteps: string[];
  
  lastUpdated: number;
};

interface ExplorationStore extends ExplorationState {
  setIntent: (intent: 'pivot' | 'growth' | 'explore' | 'curious') => void;
  addSignal: (key: SignalKey, value: number) => void;
  addMultipleSignals: (signals: Partial<Record<SignalKey, number>>) => void;
  addBehavioralBias: (biasType: 'executionBias' | 'empathyBias', value: number) => void;
  setDecisionStyle: (style: Partial<ExplorationState['decisionStyle']>) => void;
  setWorkProximity: (workProximity: string[]) => void;
  completeStep: (step: string) => void;
  resetExploration: () => void;
}

export const useExplorationStore = create<ExplorationStore>()(
  persist(
    (set, get) => ({
      intent: undefined,
      context: {},
      signals: {
        analytical: 0,
        creative: 0,
        social: 0,
        structured: 0,
        exploratory: 0,
        practical: 0,
      },
      behavioralBias: {
        executionBias: 0,
        empathyBias: 0,
      },
      completedSteps: [],
      lastUpdated: Date.now(),

      setIntent: (intent) =>
        set({
          intent,
          lastUpdated: Date.now(),
        }),

      addSignal: (key, value) =>
        set((state) => ({
          signals: {
            ...state.signals,
            [key]: state.signals[key] + value,
          },
          lastUpdated: Date.now(),
        })),

      addMultipleSignals: (newSignals) =>
        set((state) => {
          const updatedSignals = { ...state.signals };
          Object.entries(newSignals).forEach(([key, value]) => {
            if (value !== undefined) {
              updatedSignals[key as SignalKey] = updatedSignals[key as SignalKey] + value;
            }
          });
          return {
            signals: updatedSignals,
            lastUpdated: Date.now(),
          };
        }),

      addBehavioralBias: (biasType, value) =>
        set((state) => ({
          behavioralBias: {
            ...state.behavioralBias,
            [biasType]: state.behavioralBias[biasType] + value,
          },
          lastUpdated: Date.now(),
        })),

      setDecisionStyle: (style) =>
        set((state) => ({
          decisionStyle: {
            ...state.decisionStyle,
            ...style,
          },
          lastUpdated: Date.now(),
        })),

      setWorkProximity: (workProximity) =>
        set((state) => ({
          context: {
            ...state.context,
            workProximity,
          },
          lastUpdated: Date.now(),
        })),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: [...state.completedSteps, step],
          lastUpdated: Date.now(),
        })),

      resetExploration: () =>
        set({
          intent: undefined,
          context: {},
          signals: {
            analytical: 0,
            creative: 0,
            social: 0,
            structured: 0,
            exploratory: 0,
            practical: 0,
          },
          behavioralBias: {
            executionBias: 0,
            empathyBias: 0,
          },
          completedSteps: [],
          lastUpdated: Date.now(),
        }),
    }),
    { name: 'beyondstreams-exploration' }
  )
);