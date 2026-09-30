import { applyEdgeChanges, applyNodeChanges, type EdgeChange, type NodeChange } from '@xyflow/react';
import { initialPositions, modules, tickets, TOTAL_WORK_UNITS } from './data';
import { ACTION_COSTS, clampSatisfaction, STARTING_SATISFACTION } from './rules';
import type { ComponentKind, GameEdge, GameNode, GameState, ModuleNodeData, StakeholderRole, ValidationReport } from './types';

export const STORAGE_KEY = 'monolith-mayhem-v2';
export function createInitialState(): GameState {
  const nodes: GameNode[] = modules.map((module) => ({ id: module.id, type: 'group', position: initialPositions[module.id], style: { width: 260, height: 190 }, data: { name: module.name, description: module.description, color: module.color, layer: module.layer, collapsed: false } satisfies ModuleNodeData }));
  return { currentLevel: 1, nodes, edges: [], completedTickets: [], activeTicketIndex: 0, score: 0, remainingTime: TOTAL_WORK_UNITS, stakeholders: { ...STARTING_SATISFACTION }, status: 'playing', godModuleAccepted: false, changeEventIndex: 0, paymentChoice: null, lastFeedback: '', lastValidation: null };
}
export type GameAction =
  | { type: 'nodes'; changes: NodeChange<GameNode>[] }
  | { type: 'edges'; changes: EdgeChange<GameEdge>[] }
  | { type: 'add-component'; moduleId: string; definitionId: string; name: string; kind: ComponentKind; description: string }
  | { type: 'move-component'; componentId: string; moduleId: string; position: { x: number; y: number }; moduleName: string }
  | { type: 'remove-component'; componentId: string }
  | { type: 'toggle-module'; moduleId: string }
  | { type: 'add-edge'; edge: GameEdge }
  | { type: 'validate-ticket'; ticketId: string; report: ValidationReport; coupling: number; cycleCount: number; sharedAbuse: boolean; explanation: string }
  | { type: 'consult'; role: StakeholderRole; message: string }
  | { type: 'god-module' }
  | { type: 'change-event'; message: string }
  | { type: 'payment-choice'; choice: NonNullable<GameState['paymentChoice']> }
  | { type: 'reset' };

const settle = (state: GameState): GameState => {
  if (state.status !== 'playing') return state;
  if (state.remainingTime <= 0 || Object.values(state.stakeholders).some((score) => score <= 0)) return { ...state, status: 'lost' };
  if (state.completedTickets.length >= tickets.length && state.paymentChoice && state.changeEventIndex > 0) return { ...state, status: 'won' };
  return state;
};
const spend = (state: GameState, cost: number): GameState | null => {
  if (state.status !== 'playing' || state.remainingTime < cost) return null;
  return { ...state, remainingTime: state.remainingTime - cost, stakeholders: { ...state.stakeholders, po: clampSatisfaction(state.stakeholders.po - cost) } };
};
const blocked = (state: GameState, cost: number): GameState => state.status !== 'playing' ? state : { ...state, lastFeedback: `No alcanza el tiempo: esta acción requiere ${cost} unidades.` };

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'reset') return createInitialState();
  if (action.type === 'nodes') return { ...state, nodes: applyNodeChanges(action.changes, state.nodes) };
  if (action.type === 'edges') {
    const removals = action.changes.filter((change) => change.type === 'remove').length;
    if (!removals) return { ...state, edges: applyEdgeChanges(action.changes, state.edges) as GameEdge[] };
    const cost = removals * ACTION_COSTS.dependency; const charged = spend(state, cost);
    if (!charged) return blocked(state, cost);
    return settle({ ...charged, edges: applyEdgeChanges(action.changes, state.edges) as GameEdge[], lastFeedback: `Se quitaron ${removals} dependencia(s). −${cost} unidades.` });
  }
  if (state.status !== 'playing') return state;

  switch (action.type) {
    case 'add-component': {
      if (state.nodes.some((node) => node.id === action.definitionId)) return state;
      const cost = ACTION_COSTS.addComponent; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      const module = state.nodes.find((node) => node.id === action.moduleId); const siblings = state.nodes.filter((node) => node.parentId === action.moduleId);
      const nodes = [...charged.nodes, { id: action.definitionId, type: 'component' as const, parentId: action.moduleId, position: { x: 14 + (siblings.length % 2) * 120, y: 44 + Math.floor(siblings.length / 2) * 47 }, data: { name: action.name, kind: action.kind, description: action.description, moduleName: String(module?.data.name ?? action.moduleId) } }];
      return settle({ ...charged, nodes, lastFeedback: `Agregaste ${action.name}. −${cost} unidad.` });
    }
    case 'move-component': {
      const component = state.nodes.find((node) => node.id === action.componentId);
      if (!component || component.type !== 'component') return state;
      const cost = ACTION_COSTS.moveComponent; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      const nodes = charged.nodes.map((node) => node.id === action.componentId && node.type === 'component' ? { ...node, parentId: action.moduleId, position: action.position, data: { ...node.data, moduleName: action.moduleName } } : node);
      return settle({ ...charged, nodes, lastFeedback: `Moviste ${component.data.name} a ${action.moduleName}. −${cost} unidad.` });
    }
    case 'remove-component': {
      const component = state.nodes.find((node) => node.id === action.componentId && node.type === 'component'); if (!component) return state;
      const cost = ACTION_COSTS.removeComponent; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      const nodes = charged.nodes.filter((node) => node.id !== action.componentId);
      const edges = charged.edges.filter((edge) => edge.source !== action.componentId && edge.target !== action.componentId);
      return settle({ ...charged, nodes, edges, lastFeedback: `Quitaste ${component.data.name} y sus conexiones. −${cost} unidad.` });
    }
    case 'toggle-module': return { ...state, nodes: state.nodes.map((node) => node.id === action.moduleId && node.type === 'group' ? { ...node, data: { ...node.data, collapsed: !node.data.collapsed } } : node) };
    case 'add-edge': {
      if (state.edges.some((edge) => edge.source === action.edge.source && edge.target === action.edge.target)) return state;
      const cost = ACTION_COSTS.dependency; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      return settle({ ...charged, edges: [...charged.edges, action.edge], lastFeedback: `Creaste una dependencia. −${cost} unidades.` });
    }
    case 'validate-ticket': {
      const cost = ACTION_COSTS.validation + (action.report.valid ? 0 : ACTION_COSTS.failedValidation); const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      const cycleWarnings = action.report.warnings.filter((warning) => warning.title === 'Dependencia circular').length;
      const qaWarnings = action.report.warnings.filter((warning) => warning.title === 'Dependencia circular' || warning.title === 'Acceso entre dominios').length;
      const sharedWarnings = action.sharedAbuse ? 1 : 0;
      const infraPenalty = Math.ceil(action.coupling / 10) + cycleWarnings * 10 + sharedWarnings * 10;
      const qaDelta = action.report.valid ? (qaWarnings === 0 ? 5 : 0) : -20;
      let stakeholders = { ...charged.stakeholders, qa: clampSatisfaction(charged.stakeholders.qa + qaDelta), infra: clampSatisfaction(charged.stakeholders.infra - infraPenalty) };
      let completedTickets = charged.completedTickets;
      let activeTicketIndex = charged.activeTicketIndex;
      let score = charged.score;
      const qaIssueCount = action.report.missingComponents.length + action.report.missingDependencies.length + action.report.warnings.length;
      let lastFeedback = action.report.valid ? `Ticket completado. ${action.explanation} QA reporta ${qaIssueCount} observación(es).` : `QA encontró ${qaIssueCount} problema(s). −${cost} unidades.`;
      if (action.report.valid) {
        completedTickets = completedTickets.includes(action.ticketId) ? completedTickets : [...completedTickets, action.ticketId];
        activeTicketIndex += 1; score += 100; stakeholders = { ...stakeholders, po: clampSatisfaction(stakeholders.po + 10) };
      }
      lastFeedback += ` Infra revisó el acoplamiento (${action.coupling}/100): −${infraPenalty} satisfacción.`;
      if (cycleWarnings || sharedWarnings) lastFeedback += ' Infra cuestiona los límites: hay ciclos o demasiada lógica compartida.';
      const next = settle({ ...charged, stakeholders, completedTickets, activeTicketIndex, score, lastFeedback, lastValidation: action.report, currentLevel: completedTickets.length >= 2 ? 2 : 1 });
      return next;
    }
    case 'consult': {
      const cost = ACTION_COSTS.consultation; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      return settle({ ...charged, lastFeedback: `${action.role.toUpperCase()} · ${action.message} (consulta: −${cost} unidades)` });
    }
    case 'god-module': return { ...state, godModuleAccepted: true };
    case 'change-event': {
      const cost = ACTION_COSTS.changeEvent; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      return settle({ ...charged, changeEventIndex: charged.changeEventIndex + 1, lastFeedback: `${action.message} −${cost} unidades.` });
    }
    case 'payment-choice': {
      const cost = ACTION_COSTS.paymentChoice; const charged = spend(state, cost); if (!charged) return blocked(state, cost);
      return settle({ ...charged, paymentChoice: action.choice, lastFeedback: `Decisión de Payments registrada. −${cost} unidades.` });
    }
  }
}
export function saveGame(state: GameState, storage: Pick<Storage, 'setItem'> = localStorage): void {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* The game remains playable when browser storage is unavailable. */ }
}
export function loadGame(storage: Pick<Storage, 'getItem'> = localStorage): GameState {
  try {
    const raw = storage.getItem(STORAGE_KEY); if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return createInitialState();
    return { ...createInitialState(), ...parsed } as GameState;
  } catch { return createInitialState(); }
}
