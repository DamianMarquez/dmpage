import { applyEdgeChanges, applyNodeChanges, type EdgeChange, type NodeChange } from '@xyflow/react';
import { initialPositions, modules } from './data';
import type { ComponentKind, GameEdge, GameNode, GameState, ModuleNodeData } from './types';

export const STORAGE_KEY = 'monolith-mayhem-v1';
export function createInitialState(): GameState {
  const nodes: GameNode[] = modules.map((module) => ({ id: module.id, type: 'group', position: initialPositions[module.id], style: { width: 260, height: 190 }, data: { name: module.name, description: module.description, color: module.color, collapsed: false } satisfies ModuleNodeData }));
  return { difficulty: 'easy', currentLevel: 1, nodes, edges: [], completedTickets: [], activeTicketIndex: 0, score: 0, tutorialComplete: false, godModuleAccepted: false, changeEventIndex: 0, paymentChoice: null };
}
export type GameAction =
  | { type: 'nodes'; changes: NodeChange<GameNode>[] }
  | { type: 'edges'; changes: EdgeChange<GameEdge>[] }
  | { type: 'add-component'; moduleId: string; definitionId: string; name: string; kind: ComponentKind; description: string }
  | { type: 'move-component'; componentId: string; moduleId: string; position: { x: number; y: number }; moduleName: string }
  | { type: 'toggle-module'; moduleId: string }
  | { type: 'add-edge'; edge: GameEdge }
  | { type: 'complete-ticket'; ticketId: string }
  | { type: 'difficulty'; difficulty: GameState['difficulty'] }
  | { type: 'tutorial' }
  | { type: 'god-module' }
  | { type: 'change-event' }
  | { type: 'payment-choice'; choice: NonNullable<GameState['paymentChoice']> }
  | { type: 'reset' };
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'nodes': return { ...state, nodes: applyNodeChanges(action.changes, state.nodes) };
    case 'edges': return { ...state, edges: applyEdgeChanges(action.changes, state.edges) as GameEdge[] };
    case 'add-component': {
      if (state.nodes.some((node) => node.id === action.definitionId)) return state;
      const module = state.nodes.find((node) => node.id === action.moduleId);
      const siblings = state.nodes.filter((node) => node.parentId === action.moduleId);
      return { ...state, nodes: [...state.nodes, { id: action.definitionId, type: 'component' as const, parentId: action.moduleId, position: { x: 14 + (siblings.length % 2) * 120, y: 44 + Math.floor(siblings.length / 2) * 47 }, data: { name: action.name, kind: action.kind, description: action.description, moduleName: String(module?.data.name ?? action.moduleId) } }] };
    }
    case 'move-component': return { ...state, nodes: state.nodes.map((node) => node.id === action.componentId && node.type === 'component' ? { ...node, parentId: action.moduleId, position: action.position, data: { ...node.data, moduleName: action.moduleName } } : node) };
    case 'toggle-module': return { ...state, nodes: state.nodes.map((node) => node.id === action.moduleId && node.type === 'group' ? { ...node, data: { ...node.data, collapsed: !node.data.collapsed } } : node) };
    case 'add-edge': return state.edges.some((edge) => edge.source === action.edge.source && edge.target === action.edge.target) ? state : { ...state, edges: [...state.edges, action.edge] };
    case 'complete-ticket': {
      if (state.completedTickets.includes(action.ticketId)) return state;
      const completedTickets = [...state.completedTickets, action.ticketId];
      return { ...state, completedTickets, activeTicketIndex: state.activeTicketIndex + 1, currentLevel: completedTickets.length >= 2 ? 2 : 1, score: state.score + 100 };
    }
    case 'difficulty': return { ...state, difficulty: action.difficulty };
    case 'tutorial': return { ...state, tutorialComplete: true };
    case 'god-module': return { ...state, godModuleAccepted: true };
    case 'change-event': return { ...state, changeEventIndex: state.changeEventIndex + 1 };
    case 'payment-choice': return { ...state, paymentChoice: action.choice };
    case 'reset': return createInitialState();
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
