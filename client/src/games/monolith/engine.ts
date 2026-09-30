import type { ArchitectureMetrics, ArchitectureTicket, ArchitectureWarning, GameEdge, GameNode } from './types';

const componentNodes = (nodes: GameNode[]) => nodes.filter((node) => node.type !== 'group');
const moduleOf = (node: GameNode) => node.parentId ?? node.id;

export function findCycles(nodes: GameNode[], edges: GameEdge[]): string[][] {
  const ids = new Set(componentNodes(nodes).map((node) => node.id));
  const graph = new Map<string, string[]>();
  edges.forEach((edge) => { if (ids.has(edge.source) && ids.has(edge.target)) graph.set(edge.source, [...(graph.get(edge.source) ?? []), edge.target]); });
  const cycles: string[][] = [];
  const visiting = new Set<string>(); const visited = new Set<string>(); const stack: string[] = [];
  const visit = (id: string) => {
    if (visiting.has(id)) { const index = stack.indexOf(id); const cycle = stack.slice(index); if (cycle.length > 1 && !cycles.some((entry) => entry.slice().sort().join() === cycle.slice().sort().join())) cycles.push(cycle); return; }
    if (visited.has(id)) return;
    visiting.add(id); stack.push(id);
    (graph.get(id) ?? []).forEach(visit);
    stack.pop(); visiting.delete(id); visited.add(id);
  };
  ids.forEach(visit);
  return cycles;
}

export function listChangeImpact(moduleId: string, nodes: GameNode[], edges: GameEdge[]): string[] {
  const components = componentNodes(nodes); const byId = new Map(components.map((node) => [node.id, node]));
  const impacted = new Set(components.filter((node) => moduleOf(node) === moduleId).map((node) => node.id));
  const queue = [...impacted];
  while (queue.length) {
    const provider = queue.shift()!;
    edges.filter((edge) => edge.target === provider).forEach((edge) => {
      if (!impacted.has(edge.source) && byId.has(edge.source)) { impacted.add(edge.source); queue.push(edge.source); }
    });
  }
  return [...impacted];
}

export function calculateChangeImpact(moduleId: string, nodes: GameNode[], edges: GameEdge[]): number {
  return listChangeImpact(moduleId, nodes, edges).length;
}

export function calculateMetrics(nodes: GameNode[], edges: GameEdge[]): ArchitectureMetrics {
  const components = componentNodes(nodes); const modules = new Set(components.map(moduleOf));
  const externalEdges = edges.filter((edge) => moduleOf(components.find((node) => node.id === edge.source) ?? { id: '', parentId: '' } as GameNode) !== moduleOf(components.find((node) => node.id === edge.target) ?? { id: '', parentId: '' } as GameNode));
  const cycles = findCycles(nodes, edges);
  const sharedEdges = externalEdges.filter((edge) => moduleOf(components.find((node) => node.id === edge.target) ?? { id: '', parentId: '' } as GameNode) === 'common').length;
  const coupling = Math.min(100, Math.round(externalEdges.reduce((sum, edge) => sum + ((edge.data?.couplingWeight ?? 1) * 7), 0) + cycles.length * 14 + sharedEdges * 5));
  const internalEdges = edges.length - externalEdges.length;
  const cohesion = components.length === 0 ? 100 : Math.max(0, Math.min(100, Math.round(72 + (internalEdges / Math.max(1, edges.length)) * 22 - Math.max(0, modules.size - 3) * 3)));
  const complexity = Math.min(100, Math.round(components.length * 2 + edges.length * 3 + externalEdges.length * 3 + modules.size * 2));
  const changeImpact = modules.size ? Math.round([...modules].reduce((sum, id) => sum + calculateChangeImpact(id, nodes, edges), 0) / modules.size) : 0;
  const architectureHealth = Math.max(0, Math.min(100, Math.round(100 - coupling * 0.38 - complexity * 0.17 + (cohesion - 70) * 0.18 - cycles.length * 12)));
  return { coupling, cohesion, complexity, changeImpact, architectureHealth, score: Math.max(0, Math.round(architectureHealth * 0.7 + cohesion * 0.2 + Math.max(0, 100 - complexity) * 0.1)) };
}

export function analyzeArchitecture(nodes: GameNode[], edges: GameEdge[]): ArchitectureWarning[] {
  const components = componentNodes(nodes); const warnings: ArchitectureWarning[] = [];
  const byModule = new Map<string, GameNode[]>();
  components.forEach((node) => { const id = moduleOf(node); byModule.set(id, [...(byModule.get(id) ?? []), node]); });
  byModule.forEach((members, moduleId) => {
    const outgoing = edges.filter((edge) => members.some((node) => node.id === edge.source) && moduleOf(components.find((node) => node.id === edge.target) ?? { id: '', parentId: '' } as GameNode) !== moduleId);
    if (members.length >= 6) warnings.push({ id: `god-${moduleId}`, severity: 'warning', title: 'God Module', message: `${moduleId} concentra demasiadas responsabilidades.`, moduleId });
    if (outgoing.length >= 4) warnings.push({ id: `coupling-${moduleId}`, severity: 'warning', title: 'Acoplamiento alto', message: `${moduleId} depende de muchos módulos externos.`, moduleId });
  });
  const sharedConsumers = new Set(edges.filter((edge) => moduleOf(components.find((node) => node.id === edge.target) ?? { id: '', parentId: '' } as GameNode) === 'common').map((edge) => moduleOf(components.find((node) => node.id === edge.source) ?? { id: '', parentId: '' } as GameNode)));
  if (sharedConsumers.size >= 3) warnings.push({ id: 'shared-abuse', severity: 'warning', title: 'Abuso de Shared/Common', message: 'Demasiados módulos dependen de Common; se está volviendo un punto central de acoplamiento.', moduleId: 'common' });
  components.filter((node) => node.data.kind === 'repository').forEach((node) => {
    const sourceModule = moduleOf(node);
    if (edges.some((edge) => edge.target === node.id && moduleOf(components.find((entry) => entry.id === edge.source) ?? { id: '', parentId: '' } as GameNode) !== sourceModule)) warnings.push({ id: `cross-${node.id}`, severity: 'warning', title: 'Acceso entre dominios', message: `${node.data.name} recibe acceso directo desde otro módulo. Preferí una capacidad de servicio.`, moduleId: sourceModule });
  });
  findCycles(nodes, edges).forEach((cycle, index) => warnings.push({ id: `cycle-${index}`, severity: 'danger', title: 'Dependencia circular', message: `Hay un ciclo entre ${cycle.map((id) => components.find((node) => node.id === id)?.data.name ?? id).join(' → ')}.` }));
  return warnings;
}

export function validateTicket(ticket: ArchitectureTicket, nodes: GameNode[], edges: GameEdge[]): { valid: boolean; missingComponents: string[]; missingDependencies: [string, string][] } {
  const present = new Set(componentNodes(nodes).map((node) => node.id));
  const missingComponents = ticket.requiredComponents.filter((id) => !present.has(id));
  const existing = new Set(edges.map((edge) => `${edge.source}->${edge.target}`));
  const missingDependencies = (ticket.requiredDependencies ?? []).filter(([source, target]) => !existing.has(`${source}->${target}`));
  return { valid: missingComponents.length === 0 && missingDependencies.length === 0, missingComponents, missingDependencies };
}
