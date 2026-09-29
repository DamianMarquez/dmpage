export interface ArchitectureLane {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
}

export interface FallingComponent {
  id: string;
  name: string;
  laneId: string;
  kind: string;
  explanation: string;
}

export const architectureLanes: ArchitectureLane[] = [
  { id: 'domain', label: 'Domain', shortLabel: 'CORE', description: 'Entidades, Value Objects y reglas de negocio puras. El corazón no depende de adapters.' },
  { id: 'input-adapter', label: 'Input Adapter', shortLabel: 'IN ADAPTER', description: 'Inicia un caso de uso: REST Controller, CLI, UI o Event Handler.' },
  { id: 'input-port', label: 'Input Port', shortLabel: 'IN PORT', description: 'Contrato de entrada que define cómo invocar un caso de uso.' },
  { id: 'application-service', label: 'Application Service', shortLabel: 'SERVICE', description: 'Orquesta el caso de uso; depende de puertos, no de adapters concretos.' },
  { id: 'output-port', label: 'Output Port', shortLabel: 'OUT PORT', description: 'Contrato que la aplicación necesita para comunicarse con el exterior.' },
  { id: 'output-adapter', label: 'Output Adapter', shortLabel: 'OUT ADAPTER', description: 'Implementa un Output Port con tecnología concreta, como DB o API.' },
];

export const fallingComponents: FallingComponent[] = [
  { id: 'user-controller', name: 'UserController', laneId: 'input-adapter', kind: 'REST Controller · Input Adapter', explanation: 'Recibe una petición externa e invoca un Input Port.' },
  { id: 'create-user-use-case', name: 'CreateUserUseCase', laneId: 'input-port', kind: 'Caso de uso · Input Port', explanation: 'Es el contrato de entrada que permite invocar la creación de usuario.' },
  { id: 'user-service', name: 'UserService', laneId: 'application-service', kind: 'Application Service', explanation: 'Orquesta el caso de uso y habla con el exterior mediante puertos.' },
  { id: 'user-repository', name: 'UserRepository', laneId: 'output-adapter', kind: 'Repository · Output Adapter', explanation: 'Es una implementación concreta que conecta con el almacenamiento.' },
  { id: 'i-user-repository', name: 'IUserRepository', laneId: 'output-port', kind: 'Output Port', explanation: 'Define el contrato que necesita el servicio; no conoce la base de datos.' },
  { id: 'user', name: 'User', laneId: 'domain', kind: 'Domain Entity', explanation: 'Representa una entidad del dominio y sus reglas esenciales.' },
  { id: 'user-repository-interface', name: 'UserRepositoryInterface', laneId: 'output-port', kind: 'Output Port', explanation: 'Aunque cambie el nombre, sigue siendo una abstracción que implementa un adapter.' },
];

export const architectureLessons = [
  'Input Adapter → Input Port → Application Service',
  'Application Service → Output Port → Output Adapter',
  'Application Service conoce el contrato del Output Port, nunca el adapter concreto.',
  'Domain mantiene las reglas del negocio y no depende de adapters.',
];
