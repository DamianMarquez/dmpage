import type { Edge, Node } from '@xyflow/react';

export type ComponentKind = 'controller' | 'service' | 'repository' | 'domain' | 'client' | 'validator' | 'shared';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export interface MonolithModule { id: string; name: string; description: string; color: string; }
export interface ComponentDefinition { id: string; name: string; moduleId: string; kind: ComponentKind; description: string; }
export interface ComponentNodeData extends Record<string, unknown> { name: string; kind: ComponentKind; description: string; moduleName: string; }
export interface ModuleNodeData extends Record<string, unknown> { name: string; description: string; color: string; collapsed: boolean; onToggle?: (id: string) => void; }
export type GameNode = Node<ComponentNodeData, 'component'> | Node<ModuleNodeData, 'group'>;
export interface DependencyData extends Record<string, unknown> { reason: string; couplingWeight: number; }
export type GameEdge = Edge<DependencyData>;
export interface ArchitectureTicket { id: string; title: string; description: string; requiredComponents: string[]; requiredDependencies?: [string, string][]; optionalComponents?: string[]; explanation: string; }
export interface ArchitectureMetrics { coupling: number; cohesion: number; complexity: number; changeImpact: number; architectureHealth: number; score: number; }
export interface ArchitectureWarning { id: string; severity: 'warning' | 'danger'; title: string; message: string; moduleId?: string; }
export interface GameState { difficulty: GameDifficulty; currentLevel: number; nodes: GameNode[]; edges: GameEdge[]; completedTickets: string[]; activeTicketIndex: number; score: number; tutorialComplete: boolean; godModuleAccepted: boolean; changeEventIndex: number; paymentChoice: 'monolith' | 'module' | 'microservice' | null; }
