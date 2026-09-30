import type { ArchitectureTicket, ComponentDefinition, GameDifficulty, MonolithModule } from './types';

export const modules: MonolithModule[] = [
  { id: 'users', name: 'Users', description: 'Identidad y perfil de usuario', color: '#7c6dfa' },
  { id: 'orders', name: 'Orders', description: 'Ciclo de vida de las órdenes', color: '#fa8d6d' },
  { id: 'products', name: 'Products', description: 'Catálogo y disponibilidad', color: '#6dfabc' },
  { id: 'payments', name: 'Payments', description: 'Cobros y reembolsos', color: '#ffd166' },
  { id: 'notifications', name: 'Notifications', description: 'Mensajes a clientes', color: '#50c8e8' },
  { id: 'reports', name: 'Reports', description: 'Consultas y reportes', color: '#f28ab2' },
  { id: 'common', name: 'Common', description: 'Utilidades compartidas: usalas con cuidado', color: '#a4a4b5' },
];

export const componentCatalog: ComponentDefinition[] = [
  ...modules.flatMap((module) => {
    const name = module.name.slice(0, -1);
    return [
      { id: `${module.id}-controller`, name: `${name}Controller`, moduleId: module.id, kind: 'controller' as const, description: `Recibe las solicitudes de ${module.name.toLowerCase()}.` },
      { id: `${module.id}-service`, name: `${name}Service`, moduleId: module.id, kind: 'service' as const, description: `Coordina las operaciones de ${module.name.toLowerCase()}.` },
      { id: `${module.id}-repository`, name: `${name}Repository`, moduleId: module.id, kind: 'repository' as const, description: `Lee y guarda los datos de ${module.name.toLowerCase()}.` },
    ];
  }),
  { id: 'email-client', name: 'EmailClient', moduleId: 'notifications', kind: 'client', description: 'Conecta con el proveedor de correo.' },
  { id: 'payment-client', name: 'PaymentClient', moduleId: 'payments', kind: 'client', description: 'Conecta con el proveedor de pagos.' },
  { id: 'order-domain', name: 'Order', moduleId: 'orders', kind: 'domain', description: 'Reglas y estado del dominio de órdenes.' },
  { id: 'product-domain', name: 'Product', moduleId: 'products', kind: 'domain', description: 'Producto y disponibilidad.' },
  { id: 'shared-utils', name: 'CommonUtils', moduleId: 'common', kind: 'shared', description: 'Funciones transversales reutilizables.' },
];

export const tickets: ArchitectureTicket[] = [
  { id: 'user', title: 'Crear un usuario', description: 'Una petición entra por el controller, pasa por el service y se guarda en el repository.', requiredComponents: ['users-controller', 'users-service', 'users-repository'], explanation: 'Separar entrada, coordinación y persistencia hace que cada pieza tenga una responsabilidad clara.' },
  { id: 'order', title: 'Crear una orden', description: 'Construí la estructura básica para gestionar órdenes.', requiredComponents: ['orders-controller', 'orders-service', 'orders-repository'], explanation: 'Orders queda dentro de la misma aplicación, con una frontera propia.' },
  { id: 'stock', title: 'Verificar el stock', description: 'Al crear una orden, consultá la disponibilidad de Products.', requiredComponents: ['products-service'], requiredDependencies: [['orders-service', 'products-service']], explanation: 'Orders depende de la capacidad de Products. La dependencia es explícita y razonable.' },
  { id: 'payment', title: 'Pagar y notificar', description: 'Al pagar una orden, Payments debe coordinar el aviso al cliente.', requiredComponents: ['payments-service', 'notifications-service'], requiredDependencies: [['orders-service', 'payments-service'], ['payments-service', 'notifications-service']], explanation: 'Una dirección clara de dependencias reduce ciclos y deja visible quién usa cada capacidad.' },
  { id: 'reports', title: 'Preparar reportes', description: 'Los reportes necesitan datos de órdenes y productos.', requiredComponents: ['reports-service'], requiredDependencies: [['reports-service', 'orders-service'], ['reports-service', 'products-service']], explanation: 'Reports consulta dos módulos. Cada módulo adicional que depende de ellos también amplía el impacto de un cambio.' },
];

export const difficultyOptions: { id: GameDifficulty; label: string; description: string }[] = [
  { id: 'easy', label: 'Fácil', description: 'Guía visible y métricas simplificadas.' },
  { id: 'medium', label: 'Media', description: 'Más dependencias y advertencias.' },
  { id: 'hard', label: 'Difícil', description: 'Menos ayuda y eventos arquitectónicos.' },
];

export const initialPositions: Record<string, { x: number; y: number }> = {
  users: { x: 40, y: 50 }, orders: { x: 340, y: 50 }, products: { x: 640, y: 50 },
  payments: { x: 40, y: 280 }, notifications: { x: 340, y: 280 }, reports: { x: 640, y: 280 }, common: { x: 940, y: 160 },
};
