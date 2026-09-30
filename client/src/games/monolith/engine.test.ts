import { describe, expect, it } from 'vitest';
import { analyzeArchitecture, calculateChangeImpact, calculateMetrics, createValidationReport, findCycles, validateTicket } from './engine';
import { componentCatalog, modules, tickets, TOTAL_WORK_UNITS } from './data';
import { ACTION_COSTS } from './rules';
import { createInitialState, gameReducer, loadGame, saveGame, STORAGE_KEY } from './state';
import type { GameEdge, GameNode, ValidationReport } from './types';

const nodes: GameNode[] = [
  { id: 'users', type: 'group', position: { x: 0, y: 0 }, data: { name: 'Users', description: '', color: '#fff', layer: 'backend', collapsed: false } },
  { id: 'orders', type: 'group', position: { x: 300, y: 0 }, data: { name: 'Orders', description: '', color: '#fff', layer: 'backend', collapsed: false } },
  { id: 'reports', type: 'group', position: { x: 600, y: 0 }, data: { name: 'Reports', description: '', color: '#fff', layer: 'backend', collapsed: false } },
  { id: 'users-service', type: 'component', parentId: 'users', position: { x: 0, y: 0 }, data: { name: 'UserService', kind: 'service', description: '', moduleName: 'Users' } },
  { id: 'orders-service', type: 'component', parentId: 'orders', position: { x: 0, y: 0 }, data: { name: 'OrderService', kind: 'service', description: '', moduleName: 'Orders' } },
  { id: 'reports-service', type: 'component', parentId: 'reports', position: { x: 0, y: 0 }, data: { name: 'ReportService', kind: 'service', description: '', moduleName: 'Reports' } },
  { id: 'users-repository', type: 'component', parentId: 'users', position: { x: 0, y: 0 }, data: { name: 'UserRepository', kind: 'repository', description: '', moduleName: 'Users' } },
];
const edge = (source: string, target: string): GameEdge => ({ id: `${source}-${target}`, source, target, data: { reason: 'requerimiento', couplingWeight: 1 } });
const chain = [edge('orders-service', 'users-service'), edge('reports-service', 'orders-service')];
const validReport: ValidationReport = { valid: true, missingComponents: [], missingDependencies: [], warnings: [] };
const failReport: ValidationReport = { valid: false, missingComponents: ['users-service'], missingDependencies: [], warnings: [] };

class MemoryStorage implements Pick<Storage, 'getItem' | 'setItem'> {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('architecture engine', () => {
  it('calculates external coupling and complexity consistently', () => {
    const baseline = calculateMetrics(nodes, []); const connected = calculateMetrics(nodes, chain);
    expect(connected.coupling).toBeGreaterThan(baseline.coupling);
    expect(connected.complexity).toBeGreaterThan(baseline.complexity);
    expect(connected.architectureHealth).toBeLessThanOrEqual(100);
  });
  it('counts transitive consumers when a provider changes', () => expect(calculateChangeImpact('users', nodes, chain)).toBe(4));
  it('finds cycles and reports them as architecture warnings', () => {
    const circular = [...chain, edge('users-service', 'orders-service')];
    expect(findCycles(nodes, circular)).toHaveLength(1);
    expect(analyzeArchitecture(nodes, circular).some((warning) => warning.title === 'Dependencia circular' && warning.severity === 'danger')).toBe(true);
  });
  it('detects direct cross-domain repository access', () => expect(analyzeArchitecture(nodes, [edge('orders-service', 'users-repository')]).some((warning) => warning.title === 'Acceso entre dominios')).toBe(true));
  it('validates hidden acceptance criteria and their direction', () => {
    const ticket = tickets[0];
    expect(validateTicket(ticket, nodes, chain).valid).toBe(false);
    expect(createValidationReport(ticket, nodes, chain).missingComponents.length).toBe(2);
    expect(validateTicket({ ...ticket, requiredComponents: ['orders-service'], requiredDependencies: [['orders-service', 'users-service']] }, nodes, chain).valid).toBe(true);
  });
  it('requires each placed component to remain in its owning module', () => {
    const ticket = { ...tickets[0], requiredComponents: ['users-service'], requiredDependencies: [] };
    const moved = nodes.map((node) => node.id === 'users-service' && node.type === 'component' ? { ...node, parentId: 'reports' } : node);
    expect(validateTicket(ticket, moved, []).missingComponents).toEqual(['users-service']);
  });
  it('defines frontend and backend slices inside the same monolith', () => {
    expect(modules.some((module) => module.id === 'frontend' && module.layer === 'frontend')).toBe(true);
    expect(componentCatalog.find((component) => component.id === 'user-form')?.kind).toBe('ui');
    expect(tickets.every((ticket) => ticket.requiredComponents.every((id) => componentCatalog.some((component) => component.id === id)))).toBe(true);
    expect(tickets[0].requiredDependencies).toContainEqual(['user-form', 'users-controller']);
  });
  it('accepts an end-to-end frontend-to-repository path for all five tickets', () => {
    const requiredIds = [...new Set(tickets.flatMap((ticket) => ticket.requiredComponents))];
    const solutionNodes: GameNode[] = [...createInitialState().nodes, ...requiredIds.map((id) => {
      const component = componentCatalog.find((entry) => entry.id === id)!;
      return { id, type: 'component' as const, parentId: component.moduleId, position: { x: 0, y: 0 }, data: { name: component.name, kind: component.kind, description: component.description, moduleName: component.moduleId } };
    })];
    const requiredEdges = [...new Map(tickets.flatMap((ticket) => ticket.requiredDependencies ?? []).map(([source, target]) => [`${source}->${target}`, edge(source, target)])).values()];
    expect(requiredIds).toHaveLength(16);
    expect(requiredEdges).toHaveLength(14);
    expect(tickets.every((ticket) => validateTicket(ticket, solutionNodes, requiredEdges).valid)).toBe(true);
    expect(requiredIds.length + requiredEdges.length * ACTION_COSTS.dependency + tickets.length * ACTION_COSTS.validation).toBe(54);
  });
});

describe('work budget and team feedback', () => {
  it('charges the configured cost for adding a component and a dependency', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'add-component', moduleId: 'frontend', definitionId: 'user-form', name: 'UserForm', kind: 'ui', description: '' });
    expect(state.remainingTime).toBe(TOTAL_WORK_UNITS - ACTION_COSTS.addComponent);
    state = gameReducer(state, { type: 'add-edge', edge: edge('user-form', 'users-service') });
    expect(state.remainingTime).toBe(TOTAL_WORK_UNITS - ACTION_COSTS.addComponent - ACTION_COSTS.dependency);
  });
  it('charges extra time and QA satisfaction after a failed validation', () => {
    const state = gameReducer(createInitialState(), { type: 'validate-ticket', ticketId: tickets[0].id, report: failReport, coupling: 0, cycleCount: 0, sharedAbuse: false, explanation: '' });
    expect(state.remainingTime).toBe(TOTAL_WORK_UNITS - ACTION_COSTS.validation - ACTION_COSTS.failedValidation);
    expect(state.stakeholders.qa).toBe(40);
    expect(state.lastValidation?.valid).toBe(false);
    expect(state.lastFeedback).toContain('QA encontró');
    expect(state.timeCapacity).toBe(TOTAL_WORK_UNITS);
    expect(state.completedTickets).toHaveLength(0);
  });
  it('does not execute an action when the remaining budget cannot cover it', () => {
    const lowTime = { ...createInitialState(), remainingTime: ACTION_COSTS.dependency - 1 };
    const state = gameReducer(lowTime, { type: 'add-edge', edge: edge('orders-service', 'users-service') });
    expect(state.edges).toHaveLength(0);
    expect(state.remainingTime).toBe(lowTime.remainingTime);
    expect(state.lastFeedback).toContain('No alcanza el tiempo');
  });
  it('charges three units for stakeholder consultations', () => {
    const state = gameReducer(createInitialState(), { type: 'consult', role: 'po', message: 'Aclaración del ticket.' });
    expect(state.remainingTime).toBe(TOTAL_WORK_UNITS - ACTION_COSTS.consultation);
    expect(state.stakeholders.po).toBe(47);
    expect(state.lastFeedback).toContain('Aclaración del ticket');
    expect(state.lastConsultation).toMatchObject({ role: 'po', message: 'Aclaración del ticket.' });
  });
  it('reduces infrastructure trust based on coupling during QA review', () => {
    const state = gameReducer(createInitialState(), { type: 'validate-ticket', ticketId: tickets[0].id, report: validReport, coupling: 40, cycleCount: 0, sharedAbuse: false, explanation: 'ok' });
    expect(state.stakeholders.infra).toBe(56);
    expect(state.stakeholders.qa).toBe(65);
    expect(state.stakeholders.po).toBe(58);
    expect(state.remainingTime).toBe(TOTAL_WORK_UNITS - ACTION_COSTS.validation + 3);
    expect(state.timeCapacity).toBe(TOTAL_WORK_UNITS + 3);
    expect(state.completedTickets).toEqual([tickets[0].id]);
  });
  it('keeps consultation as advice and charges for a concrete infrastructure recommendation', () => {
    const state = { ...createInitialState(), nodes, edges: [edge('orders-service', 'users-repository')] };
    const consulted = gameReducer(state, { type: 'consult', role: 'infra', message: 'Acceso entre dominios: reemplazá la conexión directa por el servicio público.' });
    expect(consulted.remainingTime).toBe(TOTAL_WORK_UNITS - ACTION_COSTS.consultation);
    expect(consulted.lastConsultation?.message).toContain('servicio público');
    expect(consulted.edges).toEqual(state.edges);
  });
  it('ends the game when QA trust reaches zero', () => {
    let state = createInitialState();
    for (let attempt = 0; attempt < 3; attempt += 1) state = gameReducer(state, { type: 'validate-ticket', ticketId: `failed-${attempt}`, report: failReport, coupling: 0, cycleCount: 0, sharedAbuse: false, explanation: '' });
    expect(state.stakeholders.qa).toBe(0);
    expect(state.status).toBe('lost');
  });
  it('keeps the advanced change and deployment decision inside the time budget', () => {
    const ready = { ...createInitialState(), completedTickets: tickets.slice(0, -1).map((ticket) => ticket.id), activeTicketIndex: tickets.length - 1, remainingTime: 8 };
    const state = gameReducer(ready, { type: 'validate-ticket', ticketId: tickets.at(-1)!.id, report: validReport, coupling: 0, cycleCount: 0, sharedAbuse: false, explanation: '' });
    expect(state.status).toBe('playing');
    expect(state.completedTickets).toHaveLength(tickets.length);
    const changed = gameReducer(state, { type: 'change-event', message: 'Cambio de proveedor.' });
    const decided = gameReducer(changed, { type: 'payment-choice', choice: 'module' });
    expect(decided.status).toBe('won');
    expect(decided.remainingTime).toBe(4);
  });
  it('ends the game when the work clock reaches zero', () => {
    const lastUnit = { ...createInitialState(), remainingTime: 1 };
    expect(gameReducer(lastUnit, { type: 'add-component', moduleId: 'frontend', definitionId: 'user-form', name: 'UserForm', kind: 'ui', description: '' }).status).toBe('lost');
  });
});

describe('local progress', () => {
  it('saves and restores the work budget, stakeholders, architecture and game status', () => {
    const storage = new MemoryStorage(); const state = { ...createInitialState(), remainingTime: 34, timeCapacity: 66, stakeholders: { po: 42, qa: 55, infra: 48 }, status: 'lost' as const, score: 180 };
    saveGame(state, storage);
    expect(loadGame(storage)).toMatchObject({ remainingTime: 34, timeCapacity: 66, stakeholders: state.stakeholders, status: 'lost', score: 180 });
  });
  it('migrates older saved deliveries and grants their new time rewards', () => {
    const storage = new MemoryStorage();
    const oldState: Record<string, unknown> = { ...createInitialState(), remainingTime: 20, completedTickets: tickets.slice(0, 2).map((ticket) => ticket.id) };
    delete oldState.timeCapacity;
    delete oldState.lastConsultation;
    storage.setItem('monolith-mayhem-v2', JSON.stringify(oldState));
    expect(loadGame(storage)).toMatchObject({ remainingTime: 26, timeCapacity: 66, completedTickets: tickets.slice(0, 2).map((ticket) => ticket.id) });
  });
  it('starts a fresh game when saved data is invalid', () => {
    const storage = new MemoryStorage(); storage.setItem(STORAGE_KEY, '{broken');
    expect(loadGame(storage)).toMatchObject({ currentLevel: 1, remainingTime: 60, completedTickets: [], edges: [] });
  });
});
