import { create } from 'zustand';

export const STEPS = [
  'contact',
  'occasion',
  'dateKnown',
  'dayCount',
  'dayDetails',
  'addons',
  'calculator',
  'generate',
];

export const useWizardStore = create((set, get) => ({
  stepIndex: 0,
  totalSteps: STEPS.length,
  currentStepKey: STEPS[0],

  goNext: () =>
    set((state) => {
      const next = Math.min(state.stepIndex + 1, STEPS.length - 1);
      return { stepIndex: next, currentStepKey: STEPS[next] };
    }),

  goBack: () =>
    set((state) => {
      const prev = Math.max(state.stepIndex - 1, 0);
      return { stepIndex: prev, currentStepKey: STEPS[prev] };
    }),

  goToStep: (index) =>
    set(() => ({
      stepIndex: index,
      currentStepKey: STEPS[index],
    })),

  reset: () => set({ stepIndex: 0, currentStepKey: STEPS[0] }),
}));
