import type { StakeholderRole } from './types';

export const ACTION_COSTS = {
  addComponent: 1,
  moveComponent: 1,
  removeComponent: 1,
  dependency: 2,
  validation: 2,
  failedValidation: 2,
  consultation: 3,
  changeEvent: 3,
  paymentChoice: 2,
} as const;

export const STARTING_SATISFACTION: Record<StakeholderRole, number> = { po: 50, qa: 60, infra: 60 };
export const clampSatisfaction = (value: number) => Math.max(0, Math.min(100, value));
