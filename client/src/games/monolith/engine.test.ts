import { describe, expect, it } from 'vitest';
import { analyzeArchitecture, calculateChangeImpact, calculateMetrics, findCycles, validateTicket } from './engine';
import { createInitialState, loadGame, saveGame, STORAGE_KEY } from './state';
import type { GameEdge, GameNode } from './types';

const nodes: GameNode[] = [
  { id: 'users', type: 'group', position: { x: 0, y: 0 }, data: { name: 'Users', description: '', color: '#fff', collapsed: false } },
  { id: 'orders', type: 'group', position: { x: 300, y: 0 }, data: { name: 'Orders', description: '', color: '#fff', collapsed: false } },
  { id: 'reports', type: 'group', position: { x: 600, y: 0 }, data: { name: 'Reports', description: '', color: '#fff', collapsed: false } },
  { id: 'users-service', type: 'component', parentId: 'users', position: { x: 0, y: 0 }, data: { name: 'UserService', kind: 'service', description: '', moduleName: 'Users' } },
  { id: 'orders-service', type: 'component', parentId: 'orders', position: { x: 0, y: 0 }, data: { name: 'OrderService', kind: 'service', description: '', moduleName: 'Orders' } },
  { id: 'reports-service', type: 'component', parentId: 'reports', position: { x: 0, y: 0 }, data: { name: 'ReportService', kind: 'service', description: '', moduleName: 'Reports' } },
  { id: 'users-repository', type: 'component', parentId: 'users', position: { x: 0, y: 0 }, data: { name: 'UserRepository', kind: 'repository', description: '', moduleName: 'Users' } },
];
const edge = (source: string, target: string): GameEdge => ({ id: `${source}-${target}`, source, target, data: { reason: 'requerimiento', couplingWeight: 1 } });
const chain = [edge('orders-service', 'users-service'), edge('reports-service', 'orders-service')];

class MemoryStorage implements Pick<Storage, 'getItem' | 'setItem'> {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('architecture engine', () => {
  it('calculates external coupling and complexity consistently', () => {
    const baseline = calculateMetrics(nodes, []);
    const connected = calculateMetrics(nodes, chain);
    expect(connected.coupling).toBeGreaterThan(baseline.coupling);
    expect(connected.complexity).toBeGreaterThan(baseline.complexity);
    expect(connected.architectureHealth).toBeLessThanOrEqual(100);
  });
  it('counts transitive consumers when a provider changes', () => {
    expect(calculateChangeImpact('users', nodes, chain)).toBe(4);
  });
  it('finds cycles and reports them as architecture warnings', () => {
    const circular = [...chain, edge('users-service', 'orders-service')];
    expect(findCycles(nodes, circular)).toHaveLength(1);
    expect(analyzeArchitecture(nodes, circular).some((warning) => warning.title === 'Dependencia circular' && warning.severity === 'danger')).toBe(true);
  });
  it('detects direct cross-domain repository access', () => {
    const warnings = analyzeArchitecture(nodes, [edge('orders-service', 'users-repository')]);
    expect(warnings.some((warning) => warning.title === 'Acceso entre dominios')).toBe(true);
  });
  it('validates required components and directed dependencies', () => {
    const ticket = { id: 'sample', title: 'sample', description: '', requiredComponents: ['orders-service'], requiredDependencies: [['orders-service', 'users-service'] as [string, string]], explanation: '' };
    expect(validateTicket(ticket, nodes, chain).valid).toBe(true);
    expect(validateTicket(ticket, nodes, []).missingDependencies).toEqual([['orders-service', 'users-service']]);
  });
});

describe('local progress', () => {
  it('saves and restores game state', () => {
    const storage = new MemoryStorage(); const state = { ...createInitialState(), tutorialComplete: true, score: 180 };
    saveGame(state, storage);
    expect(JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}').score).toBe(180);
    expect(loadGame(storage)).toMatchObject({ tutorialComplete: true, score: 180 });
  });
  it('starts a fresh game when saved data is invalid', () => {
    const storage = new MemoryStorage(); storage.setItem(STORAGE_KEY, '{broken');
    expect(loadGame(storage)).toMatchObject({ currentLevel: 1, completedTickets: [], edges: [] });
  });
});
