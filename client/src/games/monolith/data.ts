import type { ArchitectureTicket, ComponentDefinition, MonolithModule } from './types';

export const TOTAL_WORK_UNITS = 60;

export const modules: MonolithModule[] = [
  { id: 'frontend', name: 'Frontend', description: 'Pantallas y formularios de la aplicación', color: '#62b7ff', layer: 'frontend' },
  { id: 'users', name: 'Users', description: 'Identidad y perfil de usuario', color: '#7c6dfa', layer: 'backend' },
  { id: 'orders', name: 'Orders', description: 'Ciclo de vida de las órdenes', color: '#fa8d6d', layer: 'backend' },
  { id: 'products', name: 'Products', description: 'Catálogo y disponibilidad', color: '#6dfabc', layer: 'backend' },
  { id: 'payments', name: 'Payments', description: 'Cobros y reembolsos', color: '#ffd166', layer: 'backend' },
  { id: 'notifications', name: 'Notifications', description: 'Mensajes a clientes', color: '#50c8e8', layer: 'backend' },
  { id: 'reports', name: 'Reports', description: 'Consultas y reportes', color: '#f28ab2', layer: 'backend' },
  { id: 'common', name: 'Common', description: 'Utilidades compartidas: usalas con cuidado', color: '#a4a4b5', layer: 'backend' },
];

export const componentCatalog: ComponentDefinition[] = [
  { id: 'user-form', name: 'UserForm', moduleId: 'frontend', kind: 'ui', description: 'Formulario para registrarse y editar un perfil.' },
  { id: 'order-page', name: 'OrderPage', moduleId: 'frontend', kind: 'ui', description: 'Pantalla para crear y consultar órdenes.' },
  { id: 'checkout-view', name: 'CheckoutView', moduleId: 'frontend', kind: 'ui', description: 'Interfaz para iniciar el pago de una orden.' },
  { id: 'reports-page', name: 'ReportsPage', moduleId: 'frontend', kind: 'ui', description: 'Pantalla para consultar reportes de negocio.' },
  ...modules.filter((module) => module.layer === 'backend').flatMap((module) => {
    const name = ({ users: 'User', orders: 'Order', products: 'Product', payments: 'Payment', notifications: 'Notification', reports: 'Report', common: 'Common' } as const)[module.id as 'users' | 'orders' | 'products' | 'payments' | 'notifications' | 'reports' | 'common'];
    return [
      { id: `${module.id}-controller`, name: `${name}Controller`, moduleId: module.id, kind: 'controller' as const, description: `Recibe solicitudes API relacionadas con ${module.name.toLowerCase()}.` },
      { id: `${module.id}-service`, name: `${name}Service`, moduleId: module.id, kind: 'service' as const, description: `Coordina las operaciones de ${module.name.toLowerCase()}.` },
      { id: `${module.id}-repository`, name: `${name}Repository`, moduleId: module.id, kind: 'repository' as const, description: `Lee y guarda los datos de ${module.name.toLowerCase()}.` },
    ];
  }),
  { id: 'payments-client', name: 'PaymentClient', moduleId: 'payments', kind: 'client', description: 'Conecta con el proveedor externo de pagos.' },
  { id: 'order-domain', name: 'Order', moduleId: 'orders', kind: 'domain', description: 'Reglas y estado del dominio de órdenes.' },
  { id: 'product-domain', name: 'Product', moduleId: 'products', kind: 'domain', description: 'Producto y disponibilidad.' },
  { id: 'shared-utils', name: 'CommonUtils', moduleId: 'common', kind: 'shared', description: 'Funciones transversales reutilizables.' },
];

export const tickets: ArchitectureTicket[] = [
  {
    id: 'user', title: 'Crear un usuario',
    description: 'Permití que una persona complete su registro desde la aplicación. La información tiene que llegar al módulo responsable de usuarios y persistirse.',
    requiredComponents: ['user-form', 'users-controller', 'users-service', 'users-repository'],
    requiredDependencies: [['user-form', 'users-controller'], ['users-controller', 'users-service'], ['users-service', 'users-repository']],
    explanation: 'La interfaz, el endpoint, la coordinación y la persistencia tienen responsabilidades diferentes dentro de un solo deployment.',
    poClarification: 'El registro también debe permitir editar el perfil existente; la pantalla puede resolver ambos casos.',
    qaFocus: 'Comprobá que el formulario llegue al endpoint de Users y que los datos se persistan.',
  },
  {
    id: 'order', title: 'Crear una orden',
    description: 'Dale a una persona una forma de iniciar una orden. El flujo debe atravesar la API de Orders y guardar el resultado.',
    requiredComponents: ['order-page', 'orders-controller', 'orders-service', 'orders-repository'],
    requiredDependencies: [['order-page', 'orders-controller'], ['orders-controller', 'orders-service'], ['orders-service', 'orders-repository']],
    explanation: 'La página de Orders consume su frontera API; el backend conserva el flujo controller → service → repository.',
    poClarification: 'La persona necesita ver el estado de la orden después de crearla.',
    qaFocus: 'Seguí el recorrido desde OrderPage hasta la persistencia; no conectes la pantalla al repository.',
  },
  {
    id: 'stock', title: 'Verificar el stock',
    description: 'Antes de aceptar una orden, el sistema debe comprobar que los productos estén disponibles.',
    requiredComponents: ['products-service'],
    requiredDependencies: [['orders-service', 'products-service']],
    explanation: 'Orders usa una capacidad de Products sin acceder directamente a sus datos.',
    poClarification: 'La validación debe ocurrir durante la creación de la orden, antes de confirmarla.',
    qaFocus: 'Orders debería consultar una capacidad de Products y evitar acceder a su repository.',
  },
  {
    id: 'payment', title: 'Pagar y notificar',
    description: 'Permití iniciar el pago desde la aplicación y avisá al cliente cuando el pago se procese.',
    requiredComponents: ['checkout-view', 'payments-controller', 'payments-service', 'notifications-service'],
    requiredDependencies: [['checkout-view', 'payments-controller'], ['payments-controller', 'payments-service'], ['payments-service', 'notifications-service']],
    explanation: 'El frontend y las capacidades backend siguen dentro del mismo monolito; cada módulo mantiene su responsabilidad.',
    poClarification: 'El cliente debe poder iniciar el pago; el aviso sale después de procesarlo.',
    qaFocus: 'Revisá la ruta UI → API → PaymentService → NotificationService y buscá ciclos.',
  },
  {
    id: 'reports', title: 'Preparar reportes',
    description: 'Dale al equipo una pantalla de reportes que combine información de órdenes y productos.',
    requiredComponents: ['reports-page', 'reports-controller', 'reports-service'],
    requiredDependencies: [['reports-page', 'reports-controller'], ['reports-controller', 'reports-service'], ['reports-service', 'orders-service'], ['reports-service', 'products-service']],
    explanation: 'Reports reúne información a través de capacidades de dominio, sin cruzar directo a la infraestructura de otros módulos.',
    poClarification: 'El reporte debe mostrar datos de ambos dominios en la misma consulta.',
    qaFocus: 'La pantalla debe entrar por la API de Reports; su service puede consultar Orders y Products.',
  },
];

export const initialPositions: Record<string, { x: number; y: number }> = {
  frontend: { x: 40, y: 50 }, users: { x: 340, y: 50 }, orders: { x: 640, y: 50 }, products: { x: 940, y: 50 },
  payments: { x: 40, y: 280 }, notifications: { x: 340, y: 280 }, reports: { x: 640, y: 280 }, common: { x: 940, y: 280 },
};
