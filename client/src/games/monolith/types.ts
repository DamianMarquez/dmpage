import type { Edge, Node } from '@xyflow/react';

export type ComponentKind = 'ui' | 'controller' | 'service' | 'repository' | 'domain' | 'client' | 'validator' | 'shared';
export type StakeholderRole = 'po' | 'qa' | 'infra';
export type GameStatus = 'playing' | 'won' | 'lost';
export interface StakeholderState { po: number; qa: number; infra: number; }
export interface MonolithModule { id: string; name: string; description: string; color: string; layer: 'frontend' | 'backend'; }
export interface ComponentDefinition { id: string; name: string; moduleId: string; kind: ComponentKind; description: string; }
export interface ComponentNodeData extends Record<string, unknown> { name: string; kind: ComponentKind; description: string; moduleName: string; }
export interface ModuleNodeData extends Record<string, unknown> { name: string; description: string; color: string; layer: 'frontend' | 'backend'; collapsed: boolean; onToggle?: (id: string) => void; }
export type GameNode = Node<ComponentNodeData, 'component'> | Node<ModuleNodeData, 'group'>;
export interface DependencyData extends Record<string, unknown> { reason: string; couplingWeight: number; }
export type GameEdge = Edge<DependencyData>;
export interface ArchitectureTicket { id: string; title: string; description: string; requiredComponents: string[]; requiredDependencies?: [string, string][]; explanation: string; poClarification: string; qaFocus: string; }
export interface ArchitectureMetrics { coupling: number; cohesion: number; complexity: number; changeImpact: number; architectureHealth: number; score: number; }
export interface ArchitectureWarning { id: string; severity: 'warning' | 'danger'; title: string; message: string; moduleId?: string; }
export interface ValidationReport { valid: boolean; missingComponents: string[]; missingDependencies: [string, string][]; warnings: ArchitectureWarning[]; }
export interface ConsultationReport { role: StakeholderRole; message: string; }
export interface GameState { currentLevel: number; nodes: GameNode[]; edges: GameEdge[]; completedTickets: string[]; activeTicketIndex: number; score: number; remainingTime: number; timeCapacity: number; stakeholders: StakeholderState; status: GameStatus; godModuleAccepted: boolean; changeEventIndex: number; paymentChoice: 'monolith' | 'module' | 'microservice' | null; lastFeedback: string; lastValidation: ValidationReport | null; lastConsultation: ConsultationReport | null; }
