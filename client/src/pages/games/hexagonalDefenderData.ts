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

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export const difficultyOptions: { id: GameDifficulty; label: string; description: string }[] = [
  { id: 'easy', label: 'Fácil', description: 'Tipo y nombre visibles · 7 componentes' },
  { id: 'medium', label: 'Medio', description: 'Solo el nombre · 10 componentes' },
  { id: 'hard', label: 'Difícil', description: 'Solo el nombre · 14 componentes similares' },
];

const componentsPerRound: Record<GameDifficulty, number> = {
  easy: 7,
  medium: 10,
  hard: 14,
};

export const architectureLanes: ArchitectureLane[] = [
  { id: 'domain', label: 'Domain', shortLabel: 'CORE', description: 'Entidades, Value Objects y reglas de negocio puras. El corazón no depende de adapters.' },
  { id: 'input-adapter', label: 'Input Adapter', shortLabel: 'IN ADAPTER', description: 'Inicia un caso de uso: REST Controller, CLI, UI o Event Handler.' },
  { id: 'input-port', label: 'Input Port', shortLabel: 'IN PORT', description: 'Contrato de entrada que define cómo invocar un caso de uso.' },
  { id: 'application-service', label: 'Application Service', shortLabel: 'SERVICE', description: 'Orquesta el caso de uso; depende de puertos, no de adapters concretos.' },
  { id: 'output-port', label: 'Output Port', shortLabel: 'OUT PORT', description: 'Contrato que la aplicación necesita para comunicarse con el exterior.' },
  { id: 'output-adapter', label: 'Output Adapter', shortLabel: 'OUT ADAPTER', description: 'Implementa un Output Port con tecnología concreta, como DB o API.' },
];

const basicComponents: FallingComponent[] = [

  // =========================
  // INPUT ADAPTER
  // =========================

  {
    id: 'user-controller',
    name: 'UserController',
    laneId: 'input-adapter',
    kind: 'REST Controller · Input Adapter',
    explanation: 'Recibe una petición externa e invoca un Input Port.'
  },

  {
    id: 'user-cli',
    name: 'UserCli',
    laneId: 'input-adapter',
    kind: 'CLI · Input Adapter',
    explanation: 'Permite iniciar un caso de uso desde una interfaz de línea de comandos.'
  },

  // =========================
  // INPUT PORT
  // =========================

  {
    id: 'create-user-use-case',
    name: 'CreateUserUseCase',
    laneId: 'input-port',
    kind: 'Caso de uso · Input Port',
    explanation: 'Es el contrato de entrada que permite invocar la creación de usuario.'
  },

  {
    id: 'delete-user-use-case',
    name: 'DeleteUserUseCase',
    laneId: 'input-port',
    kind: 'Caso de uso · Input Port',
    explanation: 'Define el contrato necesario para iniciar la eliminación de un usuario.'
  },

  // =========================
  // APPLICATION SERVICE
  // =========================

  {
    id: 'user-service',
    name: 'UserService',
    laneId: 'application-service',
    kind: 'Application Service',
    explanation: 'Orquesta el caso de uso y habla con el exterior mediante puertos.'
  },

  {
    id: 'create-user-service',
    name: 'CreateUserService',
    laneId: 'application-service',
    kind: 'Application Service',
    explanation: 'Implementa y coordina el caso de uso de creación de usuario.'
  },

  // =========================
  // OUTPUT PORT
  // =========================

  {
    id: 'i-user-repository',
    name: 'IUserRepository',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'Define el contrato que necesita el servicio; no conoce la base de datos.'
  },

  {
    id: 'notification-port',
    name: 'NotificationOutputPort',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'Define cómo la aplicación necesita enviar una notificación sin conocer el proveedor concreto.'
  },

  // =========================
  // OUTPUT ADAPTER
  // =========================

  {
    id: 'user-repository',
    name: 'UserRepository',
    laneId: 'output-adapter',
    kind: 'Repository · Output Adapter',
    explanation: 'Es una implementación concreta que conecta con el almacenamiento.'
  },

  {
    id: 'email-notification-adapter',
    name: 'EmailNotificationAdapter',
    laneId: 'output-adapter',
    kind: 'Email Adapter · Output Adapter',
    explanation: 'Implementa un puerto de salida utilizando un proveedor de email.'
  },

  // =========================
  // DOMAIN
  // =========================

  {
    id: 'user',
    name: 'User',
    laneId: 'domain',
    kind: 'Domain Entity',
    explanation: 'Representa una entidad del dominio y sus reglas esenciales.'
  },

  {
    id: 'email',
    name: 'Email',
    laneId: 'domain',
    kind: 'Value Object',
    explanation: 'Representa un concepto del dominio con validaciones propias y sin depender de infraestructura.'
  },

  {
    id: 'user-status',
    name: 'UserStatus',
    laneId: 'domain',
    kind: 'Domain Enum',
    explanation: 'Representa estados válidos del dominio y no depende de infraestructura.'
  },

];

const mediumComponents: FallingComponent[] = [

  ...basicComponents,

  // INPUT ADAPTER

  {
    id: 'user-rest-controller',
    name: 'UserRestController',
    laneId: 'input-adapter',
    kind: 'REST Controller · Input Adapter',
    explanation: 'Aunque su nombre diga REST, este controller es un adapter: traduce HTTP y llama al contrato de entrada.'
  },

  {
    id: 'user-event-handler',
    name: 'UserCreatedEventHandler',
    laneId: 'input-adapter',
    kind: 'Event Handler · Input Adapter',
    explanation: 'Recibe un evento externo y lo traduce para iniciar una operación de la aplicación.'
  },

  // INPUT PORT

  {
    id: 'register-user-port',
    name: 'RegisterUserInputPort',
    laneId: 'input-port',
    kind: 'Input Port',
    explanation: 'El sufijo InputPort identifica el contrato que la aplicación ofrece para iniciar el caso de uso; no es su implementación.'
  },

  {
    id: 'update-user-port',
    name: 'UpdateUserInputPort',
    laneId: 'input-port',
    kind: 'Input Port',
    explanation: 'Define cómo puede invocarse el caso de uso de actualización sin conocer quién lo invoca.'
  },

  // APPLICATION SERVICE

  {
    id: 'user-command-service',
    name: 'UserCommandService',
    laneId: 'application-service',
    kind: 'Application Service',
    explanation: 'Coordina una operación de aplicación y utiliza puertos para interactuar con dependencias externas.'
  },

  {
    id: 'user-query-service',
    name: 'UserQueryService',
    laneId: 'application-service',
    kind: 'Application Service',
    explanation: 'Implementa lógica de aplicación para consultar información del usuario.'
  },

  // OUTPUT PORT

  {
    id: 'save-user-port',
    name: 'SaveUserOutputPort',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'El sufijo OutputPort marca una dependencia que la aplicación necesita; no contiene detalles de base de datos.'
  },

  {
    id: 'user-search-port',
    name: 'UserSearchOutputPort',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'Define el contrato para consultar usuarios sin conocer cómo se almacenan.'
  },

  // OUTPUT ADAPTER

  {
    id: 'postgres-user-repository',
    name: 'PostgresUserRepository',
    laneId: 'output-adapter',
    kind: 'PostgreSQL Repository · Output Adapter',
    explanation: 'Implementa un puerto de salida utilizando PostgreSQL, por lo que pertenece a infraestructura.'
  },

  {
    id: 'redis-user-cache',
    name: 'RedisUserCache',
    laneId: 'output-adapter',
    kind: 'Redis Adapter · Output Adapter',
    explanation: 'Conecta la aplicación con Redis y por eso representa un detalle externo de infraestructura.'
  },

  // DOMAIN

  {
    id: 'user-email',
    name: 'UserEmail',
    laneId: 'domain',
    kind: 'Value Object',
    explanation: 'Encapsula el concepto de email del dominio y sus reglas de validación.'
  },

  {
    id: 'user-created-event',
    name: 'UserCreated',
    laneId: 'domain',
    kind: 'Domain Event',
    explanation: 'Representa un hecho ocurrido dentro del dominio y no depende de infraestructura.'
  },

  {
    id: 'user-domain-service',
    name: 'UserDomainService',
    laneId: 'domain',
    kind: 'Domain Service',
    explanation: 'Contiene una regla de negocio que no pertenece naturalmente a una única entidad.'
  },

];

const hardComponents: FallingComponent[] = [

  ...mediumComponents,

  // =========================
  // INPUT ADAPTER
  // =========================

  {
    id: 'user-http-handler',
    name: 'UserHttpHandler',
    laneId: 'input-adapter',
    kind: 'HTTP Handler · Input Adapter',
    explanation: 'Recibe y traduce HTTP, por eso es un adapter de entrada aunque no se llame Controller.'
  },

  {
    id: 'user-message-consumer',
    name: 'UserMessageConsumer',
    laneId: 'input-adapter',
    kind: 'Message Consumer · Input Adapter',
    explanation: 'Consume mensajes externos y los transforma en una llamada al núcleo de aplicación.'
  },

  {
    id: 'user-graphql-resolver',
    name: 'UserResolver',
    laneId: 'input-adapter',
    kind: 'GraphQL Resolver · Input Adapter',
    explanation: 'Es un punto de entrada externo que traduce una operación GraphQL hacia el caso de uso.'
  },

  // =========================
  // INPUT PORT
  // =========================

  {
    id: 'register-user-use-case',
    name: 'RegisterUserUseCase',
    laneId: 'input-port',
    kind: 'Input Port',
    explanation: 'Expone el contrato de entrada del caso de uso; la lógica que lo implementa vive en un Application Service.'
  },

  {
    id: 'find-user-query',
    name: 'FindUserQuery',
    laneId: 'input-port',
    kind: 'Input Request · Input Port',
    explanation: 'Representa la solicitud que entra a la aplicación para ejecutar una consulta.'
  },

  // =========================
  // APPLICATION SERVICE
  // =========================

  {
    id: 'user-application-service',
    name: 'UserApplicationService',
    laneId: 'application-service',
    kind: 'Application Service',
    explanation: 'Coordina el caso de uso y sus puertos. No es un adapter aunque también se llame Service.'
  },

  {
    id: 'register-user-handler',
    name: 'RegisterUserHandler',
    laneId: 'application-service',
    kind: 'Application Service',
    explanation: 'Procesa una operación de aplicación y coordina las dependencias necesarias mediante puertos.'
  },

  // =========================
  // OUTPUT PORT
  // =========================

  {
    id: 'user-storage-port',
    name: 'UserStorageOutputPort',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'OutputPort indica un contrato de salida requerido por la aplicación; no elige ni implementa una tecnología de almacenamiento.'
  },

  {
    id: 'user-notification-port',
    name: 'UserNotificationPort',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'Define una capacidad externa requerida por la aplicación sin acoplarla a email, SMS o cualquier proveedor concreto.'
  },

  {
    id: 'external-user-api-port',
    name: 'ExternalUserApiPort',
    laneId: 'output-port',
    kind: 'Output Port',
    explanation: 'Representa el contrato que la aplicación utiliza para comunicarse con un sistema externo.'
  },

  // =========================
  // OUTPUT ADAPTER
  // =========================

  {
    id: 'postgres-user-repository',
    name: 'PostgresUserRepository',
    laneId: 'output-adapter',
    kind: 'Postgres Repository · Output Adapter',
    explanation: 'El nombre revela una tecnología concreta: implementa el contrato de salida usando PostgreSQL.'
  },

  {
    id: 'mysql-user-repository',
    name: 'MySqlUserRepository',
    laneId: 'output-adapter',
    kind: 'MySQL Repository · Output Adapter',
    explanation: 'Es una implementación concreta del almacenamiento y pertenece al mundo exterior.'
  },

  {
    id: 'sendgrid-notification-adapter',
    name: 'SendGridNotificationAdapter',
    laneId: 'output-adapter',
    kind: 'SendGrid Adapter · Output Adapter',
    explanation: 'Utiliza un proveedor externo concreto para implementar una capacidad requerida por la aplicación.'
  },

  {
    id: 'user-api-client',
    name: 'ExternalUserApiClient',
    laneId: 'output-adapter',
    kind: 'HTTP Client · Output Adapter',
    explanation: 'Implementa un puerto de salida comunicándose con una API externa mediante HTTP.'
  },

  // =========================
  // DOMAIN
  // =========================

  {
    id: 'user-entity',
    name: 'UserEntity',
    laneId: 'domain',
    kind: 'Domain Entity',
    explanation: 'Aunque use el sufijo Entity, representa una entidad del dominio y sus invariantes.'
  },

  {
    id: 'user-id',
    name: 'UserId',
    laneId: 'domain',
    kind: 'Value Object',
    explanation: 'Representa la identidad del usuario como un concepto del dominio, evitando exponer detalles de infraestructura.'
  },

  {
    id: 'money',
    name: 'Money',
    laneId: 'domain',
    kind: 'Value Object',
    explanation: 'Encapsula un valor monetario y sus reglas, por lo que pertenece al dominio.'
  },

  {
    id: 'user-policy',
    name: 'UserPolicy',
    laneId: 'domain',
    kind: 'Domain Policy',
    explanation: 'Representa una regla de negocio del dominio que puede ser utilizada por diferentes casos.'
  },

  {
    id: 'user-created-domain-event',
    name: 'UserCreatedDomainEvent',
    laneId: 'domain',
    kind: 'Domain Event',
    explanation: 'Representa un hecho relevante del dominio sin depender de Kafka, RabbitMQ u otra tecnología.'
  },

  {
    id: 'user-status-enum',
    name: 'UserStatus',
    laneId: 'domain',
    kind: 'Domain Enum',
    explanation: 'Modela estados válidos del dominio y no contiene detalles de infraestructura.'
  },

];

const componentPoolsByDifficulty: Record<GameDifficulty, FallingComponent[]> = {
  easy: basicComponents,
  medium: mediumComponents,
  hard: hardComponents,
};

export function selectRoundComponents(difficulty: GameDifficulty): FallingComponent[] {
  const candidates = [...new Map(componentPoolsByDifficulty[difficulty].map((component) => [component.id, component])).values()];
  const shuffled = [...candidates];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, componentsPerRound[difficulty]);
}

export const architectureLessons = [
  'Input Adapter → Input Port → Application Service',
  'Application Service → Output Port → Output Adapter',
  'Application Service conoce el contrato del Output Port, nunca el adapter concreto.',
  'Domain mantiene las reglas del negocio y no depende de adapters.',
];
