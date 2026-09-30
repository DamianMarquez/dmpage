import { useCallback, useEffect, useMemo, useReducer, useState, type DragEvent } from 'react';
import { Background, Controls, MiniMap, ReactFlow, ReactFlowProvider, Handle, Position, useReactFlow, type Connection, type NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../seo/SeoHead';
import { analyzeArchitecture, calculateChangeImpact, calculateMetrics, createValidationReport, listChangeImpact } from './engine';
import { componentCatalog, modules, tickets, TOTAL_WORK_UNITS } from './data';
import { ACTION_COSTS } from './rules';
import { gameReducer, loadGame, saveGame } from './state';
import type { ComponentNodeData, GameEdge, GameNode, GameState, ModuleNodeData, StakeholderRole } from './types';
import './monolith.css';

type Dispatch = React.Dispatch<Parameters<typeof gameReducer>[1]>;

function ModuleNode({ id, data }: NodeProps<GameNode>) {
  const module = data as ModuleNodeData;
  return <div className={`module-node ${module.layer} ${module.collapsed ? 'collapsed' : ''}`} style={{ borderColor: module.color }}>
    <div className="module-heading"><span className="module-orb" style={{ background: module.color }} /><strong>{module.name}</strong><small>{module.layer === 'frontend' ? 'FRONTEND' : 'BACKEND'}</small>
      <button type="button" aria-label={`${module.collapsed ? 'Expandir' : 'Contraer'} ${module.name}`} onClick={(event) => { event.stopPropagation(); module.onToggle?.(id); }}>{module.collapsed ? '+' : '−'}</button></div>
    {!module.collapsed && <><small className="module-description">{module.description}</small><span className="module-boundary-label">MÓDULO INTERNO</span></>}
  </div>;
}

function ComponentNode({ data, selected }: NodeProps<GameNode>) {
  const component = data as ComponentNodeData;
  return <div className={`component-node ${component.kind === 'ui' ? 'ui-component' : ''} ${selected ? 'selected' : ''}`}>
    <Handle type="target" position={Position.Left} /><span>{component.kind === 'ui' ? 'UI · FRONTEND' : component.kind}</span><strong>{component.name}</strong><Handle type="source" position={Position.Right} />
  </div>;
}
const nodeTypes = { group: ModuleNode, component: ComponentNode };

function MonolithCanvas({ state, dispatch, onSelect, setFeedback }: { state: GameState; dispatch: Dispatch; onSelect: (id: string | null) => void; setFeedback: (message: string) => void }) {
  const flow = useReactFlow<GameNode, GameEdge>();
  const nodes = useMemo(() => state.nodes.map((node) => {
    if (node.type === 'group') return { ...node, style: { ...node.style, height: node.data.collapsed ? 82 : 190 }, data: { ...node.data, onToggle: (id: string) => dispatch({ type: 'toggle-module', moduleId: id }) } };
    const parent = state.nodes.find((entry) => entry.id === node.parentId);
    return { ...node, hidden: Boolean(parent?.data.collapsed) };
  }), [state.nodes, dispatch]);

  const onConnect = useCallback((connection: Connection) => {
    const source = state.nodes.find((node) => node.id === connection.source);
    const target = state.nodes.find((node) => node.id === connection.target);
    if (!source || !target || source.type === 'group' || target.type === 'group' || source.id === target.id) return;
    const reason = window.prompt(`Motivo de ${source.data.name} → ${target.data.name}`, 'Necesita esta capacidad para cumplir el requerimiento');
    if (reason === null) return;
    dispatch({ type: 'add-edge', edge: { ...connection, id: `${connection.source}-${connection.target}`, source: connection.source!, target: connection.target!, type: 'smoothstep', animated: true, data: { reason, couplingWeight: 1 }, label: 'usa' } });
  }, [dispatch, state.nodes]);

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const definitionId = event.dataTransfer.getData('application/monolith-component');
    const definition = componentCatalog.find((item) => item.id === definitionId);
    if (!definition) return;
    const position = flow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const owner = state.nodes.filter((node) => node.type === 'group').find((node) => position.x >= node.position.x && position.x <= node.position.x + 260 && position.y >= node.position.y && position.y <= node.position.y + 190);
    if (!owner) { setFeedback('Soltá la pieza dentro del módulo Frontend o Backend que corresponda.'); return; }
    dispatch({ type: 'add-component', moduleId: owner.id, definitionId, name: definition.name, kind: definition.kind, description: definition.description });
  };

  return <div className="monolith-canvas" onDrop={onDrop} onDragOver={(event) => event.preventDefault()}>
    <div className="monolith-label"><strong>MONOLITH</strong><span>FRONTEND + BACKEND · UNA APLICACIÓN · UN DEPLOYMENT</span></div>
    <ReactFlow nodes={nodes} edges={state.edges} nodeTypes={nodeTypes} onNodesChange={(changes) => dispatch({ type: 'nodes', changes })} onEdgesChange={(changes) => dispatch({ type: 'edges', changes })}
      onConnect={onConnect} onNodeClick={(_, node) => onSelect(node.type === 'group' ? null : node.id)} onPaneClick={() => onSelect(null)} deleteKeyCode={null} nodesDraggable={state.status === 'playing'} nodesConnectable={state.status === 'playing'}
      onNodeDragStop={(_, node) => {
        if (node.type === 'group') return;
        const absolute = flow.getInternalNode(node.id)?.internals.positionAbsolute ?? node.position;
        const targetOwner = state.nodes.filter((entry) => entry.type === 'group').find((entry) => absolute.x >= entry.position.x && absolute.x <= entry.position.x + 260 && absolute.y >= entry.position.y && absolute.y <= entry.position.y + 190);
        const owner = targetOwner ?? state.nodes.find((entry) => entry.id === node.parentId && entry.type === 'group');
        if (!owner) { setFeedback('La pieza debe quedar dentro de un módulo.'); return; }
        if (!targetOwner) setFeedback('La pieza debe quedar dentro de un módulo.');
        const position = targetOwner ? { x: absolute.x - owner.position.x, y: absolute.y - owner.position.y } : { x: 15, y: 45 };
        dispatch({ type: 'move-component', componentId: node.id, moduleId: owner.id, position, moduleName: String(owner.data.name) });
      }} fitView minZoom={0.3} maxZoom={1.5} proOptions={{ hideAttribution: true }}>
      <Background color="#ffffff18" gap={22} /><Controls /><MiniMap nodeColor={(node) => String((node.data as ModuleNodeData).color ?? '#9388ff')} maskColor="#080810aa" />
    </ReactFlow>
  </div>;
}

function MonolithGameContent() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGame);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState('');
  useEffect(() => { saveGame(state); }, [state]);
  const metrics = useMemo(() => calculateMetrics(state.nodes, state.edges), [state.nodes, state.edges]);
  const warnings = useMemo(() => analyzeArchitecture(state.nodes, state.edges), [state.nodes, state.edges]);
  const ticket = tickets[Math.min(state.activeTicketIndex, tickets.length - 1)];
  const selected = state.nodes.find((node) => node.id === selectedId && node.type === 'component');
  const completion = (state.completedTickets.length / tickets.length) * 100;
  const impact = selected ? calculateChangeImpact(selected.parentId ?? selected.id, state.nodes, state.edges) : 0;
  const metricLabel = (value: number) => value < 30 ? 'BAJO' : value < 60 ? 'MEDIO' : 'ALTO';
  const reset = () => { if (state.status === 'playing' && !window.confirm('¿Reiniciar la partida? Se perderá el avance actual.')) return; dispatch({ type: 'reset' }); setFeedback(''); };

  const addComponent = (id: string) => {
    const definition = componentCatalog.find((item) => item.id === id);
    if (definition) dispatch({ type: 'add-component', moduleId: definition.moduleId, definitionId: id, name: definition.name, kind: definition.kind, description: definition.description });
  };

  const validate = () => {
    const report = createValidationReport(ticket, state.nodes, state.edges);
    const sharedAbuse = warnings.some((warning) => warning.id === 'shared-abuse');
    dispatch({ type: 'validate-ticket', ticketId: ticket.id, report, coupling: metrics.coupling, cycleCount: report.warnings.filter((warning) => warning.title === 'Dependencia circular').length, sharedAbuse, explanation: ticket.explanation });
  };

  const consult = (role: StakeholderRole) => {
    let message = '';
    if (role === 'po') message = ticket.poClarification;
    if (role === 'qa') {
      const report = createValidationReport(ticket, state.nodes, state.edges);
      const missing = [...report.missingComponents.map((id) => componentCatalog.find((component) => component.id === id)?.name ?? id), ...report.missingDependencies.map(([source, target]) => `${componentCatalog.find((component) => component.id === source)?.name} → ${componentCatalog.find((component) => component.id === target)?.name}`)];
      message = `${ticket.qaFocus} ${missing.length ? `Veo ${missing.length} posible(s) brecha(s), pero la validación formal sigue pendiente.` : 'No veo brechas en los criterios actuales.'}`;
    }
    if (role === 'infra') {
      const heaviest = [...state.edges].sort((a, b) => (b.data?.couplingWeight ?? 1) - (a.data?.couplingWeight ?? 1))[0];
      message = `El acoplamiento actual es ${metrics.coupling}/100 y la complejidad ${metrics.complexity}/100. ${heaviest ? `Revisaría ${state.nodes.find((node) => node.id === heaviest.source)?.data.name} → ${state.nodes.find((node) => node.id === heaviest.target)?.data.name}.` : 'Todavía no hay dependencias que revisar.'}`;
    }
    dispatch({ type: 'consult', role, message });
  };

  const simulateChange = () => {
    const affected = listChangeImpact('payments', state.nodes, state.edges).map((id) => String(state.nodes.find((node) => node.id === id)?.data.name ?? id));
    dispatch({ type: 'change-event', message: `Cambio de proveedor de pagos: ${affected.length} componentes podrían necesitar ajustes (${affected.join(', ') || 'todavía no hay componentes en Payments'}).` });
  };

  const handleGod = () => {
    dispatch({ type: 'god-module' });
    const shortcuts = [['common-god-service', 'CommonService'], ['common-order-logic', 'OrderLogic'], ['common-product-logic', 'ProductLogic'], ['common-payment-logic', 'PaymentLogic'], ['common-report-logic', 'ReportLogic'], ['common-user-logic', 'UserLogic']] as const;
    shortcuts.forEach(([id, name]) => dispatch({ type: 'add-component', moduleId: 'common', definitionId: id, name, kind: 'service', description: 'Responsabilidad de dominio concentrada en Common para ahorrar tiempo.' }));
    state.nodes.filter((node) => node.type === 'component' && node.data.kind === 'service').forEach((node) => dispatch({ type: 'add-edge', edge: { id: `${node.id}-common-god-service`, source: node.id, target: 'common-god-service', type: 'smoothstep', animated: true, data: { reason: 'Atajo temporal: concentrar la lógica en CommonService', couplingWeight: 2 } } }));
  };

  const onPaletteDrag = (event: DragEvent, id: string) => { event.dataTransfer.setData('application/monolith-component', id); event.dataTransfer.effectAllowed = 'copy'; };
  const palette = (layer: 'frontend' | 'backend') => modules.filter((module) => module.layer === layer && (module.id !== 'common' || state.currentLevel > 1)).map((module) => <div className="palette-group" key={module.id}>
    <h3><i style={{ background: module.color }} />{module.name}</h3>{componentCatalog.filter((component) => component.moduleId === module.id && component.name.toLowerCase().includes(filter.toLowerCase())).map((component) => <button type="button" draggable disabled={state.status !== 'playing'} onDragStart={(event) => onPaletteDrag(event, component.id)} onClick={() => addComponent(component.id)} key={component.id} className="palette-item"><span>{component.kind}</span><strong>{component.name}</strong><b>+1</b></button>)}
  </div>);

  const healthMeters: { role: StakeholderRole; label: string; value: number }[] = [
    { role: 'po', label: 'Product Owner', value: state.stakeholders.po },
    { role: 'qa', label: 'QA', value: state.stakeholders.qa },
    { role: 'infra', label: 'Infraestructura', value: state.stakeholders.infra },
  ];
  const timePercent = (state.remainingTime / TOTAL_WORK_UNITS) * 100;

  return <><SeoHead page="monolithMayhem" /><Navbar user={null} onOpenLogin={() => undefined} showAuthControls={false} />
    <main className="games-page monolith-page"><header className="defender-heading monolith-heading"><Link className="games-back-link" to="/games">← Todos los juegos</Link><p className="games-eyebrow">JUEGO 02 · ARQUITECTURA</p><h1>Monolith Mayhem</h1><p>Construí un monolito. Mantenelo sano. Sobreviví a los cambios.</p></header>
      <section className="monolith-shell"><header className="monolith-hud"><div className="hud-title"><span className="monolith-mark">⬡</span><div><strong>MONOLITH MAYHEM</strong><small>NIVEL {state.currentLevel} · {state.currentLevel > 1 ? 'MODULAR MONOLITH' : 'BASIC MONOLITH'}</small></div></div>
        <div className="work-clock"><span>TIEMPO DE TRABAJO</span><strong>{state.remainingTime} <small>/ 60</small></strong><div><i style={{ width: `${timePercent}%` }} /></div></div>
        <div className="hud-score"><span>SCORE</span><strong>{state.score + metrics.score}</strong></div><div className="health-meter"><span>ARCHITECTURE HEALTH</span><strong>{metrics.architectureHealth}%</strong><div><i style={{ width: `${metrics.architectureHealth}%` }} /></div></div><button className="game-small-button" onClick={reset}>↻ Reiniciar</button>
      </header>
      <div className="stakeholder-strip">{healthMeters.map(({ role, label, value }) => <div className={`stakeholder-meter ${value < 30 ? 'critical' : ''}`} key={role}><span>{label}</span><strong>{value}%</strong><div><i style={{ width: `${value}%` }} /></div></div>)}</div>
      <div className="action-cost-legend"><span>Agregar / mover / quitar pieza: <b>{ACTION_COSTS.addComponent}</b></span><span>Conectar / desconectar: <b>{ACTION_COSTS.dependency}</b></span><span>Validar: <b>{ACTION_COSTS.validation}</b> · fallar: <b>+{ACTION_COSTS.failedValidation}</b></span><span>Consultar un área: <b>{ACTION_COSTS.consultation}</b></span></div>
      <div className="metric-strip">{[['Coupling', metrics.coupling], ['Complexity', metrics.complexity], ['Change Risk', Math.min(100, metrics.changeImpact * 8 + warnings.filter((warning) => warning.severity === 'danger').length * 25)]].map(([name, value]) => <div className="metric-chip" key={name}><span>{name}</span><strong>{metricLabel(Number(value))}</strong><small>{value}/100</small></div>)}<div className="metric-chip cohesion-chip"><span>Cohesion</span><strong>{metrics.cohesion}%</strong></div></div>
      {state.lastFeedback && <div className={`game-feedback-banner ${state.status}`} role="status">{state.lastFeedback}</div>}
      <div className="game-workspace"><aside className="game-side-panel component-palette"><header><span>01 · TOOLBOX</span><h2>Componentes</h2><p>El catálogo está disponible; decidí qué agregar y dónde.</p></header><input aria-label="Filtrar componentes" placeholder="Buscar componente…" value={filter} onChange={(event) => setFilter(event.target.value)} />
        <div className="palette-layer"><h2>Frontend</h2>{palette('frontend')}</div><div className="palette-layer"><h2>Backend</h2>{palette('backend')}</div>
      </aside>
      <div className="canvas-column"><MonolithCanvas state={state} dispatch={dispatch} onSelect={setSelectedId} setFeedback={setFeedback} /><div className="canvas-legend"><span><i className="legend-module" /> Módulo</span><span><i className="legend-component" /> Componente</span><span>→ Dependencia: consumidor hacia proveedor</span><small>El Frontend consume la API del Backend; ambos módulos viven en el mismo deployment.</small></div></div>
      <aside className="game-side-panel details-panel">{selected ? <><header><span>02 · INSPECTOR</span><h2>{String(selected.data.name)}</h2><p>{String(selected.data.description)}</p></header><div className="detail-field"><span>TIPO</span><strong>{String(selected.data.kind)}</strong></div><div className="detail-field"><span>MÓDULO</span><strong>{String(selected.data.moduleName)}</strong></div><div className="detail-field"><span>CHANGE IMPACT</span><strong>{impact} componentes</strong><small>Al cambiar este módulo, podrían necesitar cambios {impact} componentes consumidores.</small></div><h3>Dependencias</h3>{state.edges.filter((edge) => edge.source === selected.id || edge.target === selected.id).map((edge) => <p className="dependency-detail" key={edge.id}>{edge.source === selected.id ? '→' : '←'} {String(state.nodes.find((node) => node.id === (edge.source === selected.id ? edge.target : edge.source))?.data.name)}<small>{edge.data?.reason}</small><button type="button" onClick={() => dispatch({ type: 'edges', changes: [{ id: edge.id, type: 'remove' }] })}>Quitar ·2</button></p>)}{!state.edges.some((edge) => edge.source === selected.id || edge.target === selected.id) && <p className="empty-hint">Sin dependencias todavía.</p>}<button type="button" className="remove-component-button" onClick={() => dispatch({ type: 'remove-component', componentId: selected.id })}>Quitar componente ·1</button></> : <><header><span>02 · INSPECTOR</span><h2>Arquitectura</h2><p>Seleccioná una pieza para inspeccionar sus conexiones y su impacto.</p></header><div className="metric-explainer"><strong>Cohesión · {metrics.cohesion}%</strong><p>Responsabilidades relacionadas dentro de cada módulo.</p></div><div className="metric-explainer"><strong>Impacto de cambio · {metrics.changeImpact}</strong><p>Promedio de componentes consumidores alcanzables desde cada módulo.</p></div>{warnings.map((warning) => <article className={`architecture-warning ${warning.severity}`} key={warning.id}><strong>{warning.severity === 'danger' ? '🔴' : '⚠'} {warning.title}</strong><p>{warning.message}</p></article>)}</>}</aside></div>
      <div className="lower-panels"><section className="ticket-panel"><div className="panel-kicker">03 · CURRENT TICKET · {Math.min(state.completedTickets.length + 1, tickets.length)} / {tickets.length}</div><div className="ticket-progress"><i style={{ width: `${completion}%` }} /></div><h2>{state.completedTickets.length >= tickets.length ? '¡Tickets completados!' : ticket.title}</h2><p>{state.completedTickets.length >= tickets.length ? 'El equipo entregó los cinco requerimientos. Revisá el estado de las áreas y el impacto de la arquitectura.' : ticket.description}</p>
        {state.completedTickets.length < tickets.length && <button className="game-primary-button" disabled={state.status !== 'playing'} onClick={validate}>Validar solución ·{ACTION_COSTS.validation}</button>}
        {state.lastValidation && <article className={`qa-report ${state.lastValidation.valid ? 'clean' : 'failed'}`}><strong>Último informe QA · {state.lastValidation.valid ? 'Ticket válido' : 'Faltan criterios'}</strong>{state.lastValidation.missingComponents.length > 0 && <p>Piezas: {state.lastValidation.missingComponents.map((id) => componentCatalog.find((component) => component.id === id)?.name ?? id).join(', ')}</p>}{state.lastValidation.missingDependencies.length > 0 && <p>Conexiones: {state.lastValidation.missingDependencies.map(([from, to]) => `${componentCatalog.find((component) => component.id === from)?.name} → ${componentCatalog.find((component) => component.id === to)?.name}`).join(', ')}</p>}{state.lastValidation.warnings.slice(0, 3).map((warning) => <p key={warning.id}>{warning.title}: {warning.message}</p>)}</article>}
      </section>
      <section className="event-panel"><div className="panel-kicker">04 · STAKEHOLDERS Y EVENTOS</div><h2>El equipo tiene algo que decir</h2><p>Las consultas cuestan tiempo. Las revisiones de QA e Infra afectan su satisfacción.</p>
        <div className="consultation-actions"><button className="game-small-button" disabled={state.status !== 'playing'} onClick={() => consult('po')}>Preguntar al PO ·{ACTION_COSTS.consultation}</button><button className="game-small-button" disabled={state.status !== 'playing'} onClick={() => consult('qa')}>Consultar QA ·{ACTION_COSTS.consultation}</button><button className="game-small-button" disabled={state.status !== 'playing'} onClick={() => consult('infra')}>Consultar Infra ·{ACTION_COSTS.consultation}</button></div>
        {state.completedTickets.length >= 3 && <><div className="advanced-row"><div><h3>Cambio de proveedor de pagos</h3><p>Revisá cuántos componentes impacta.</p></div><button className="game-small-button" disabled={state.status !== 'playing'} onClick={simulateChange}>Simular ·{ACTION_COSTS.changeEvent}</button></div><div className="advanced-row"><div><h3>Atajo: CommonService</h3><p>Concentrá responsabilidades y observá las consecuencias.</p></div><button className="game-small-button" disabled={state.status !== 'playing' || state.godModuleAccepted} onClick={handleGod}>{state.godModuleAccepted ? 'Aplicado' : 'Aplicar atajo'}</button></div></>}
        {state.completedTickets.length >= 5 && <div className="advanced-row payment-choice"><div><h3>¿Qué hacer con Payments?</h3><p>La decisión también consume tiempo.</p></div><div className="choice-buttons">{(['monolith', 'module', 'microservice'] as const).map((choice) => <button key={choice} disabled={state.status !== 'playing'} className={state.paymentChoice === choice ? 'chosen' : ''} onClick={() => dispatch({ type: 'payment-choice', choice })}>{choice === 'monolith' ? `Monolito ·${ACTION_COSTS.paymentChoice}` : choice === 'module' ? `Módulo ·${ACTION_COSTS.paymentChoice}` : `Microservicio ·${ACTION_COSTS.paymentChoice}`}</button>)}</div></div>}
        {state.paymentChoice && <div className="choice-result"><strong>{state.paymentChoice === 'monolith' ? '1 deployment · baja complejidad operativa' : state.paymentChoice === 'module' ? '1 deployment · límites internos más claros · costo de modularización' : '2 deployments · complejidad operativa alta · comunicación por red'}</strong></div>}
      </section></div>
      <section className="learning-footer"><h2>Una sola aplicación. Frontend y backend. Un deployment.</h2><p>Las capas y los módulos tienen límites explícitos sin exigir microservicios.</p><div className="level-strip"><span>NIVEL {state.currentLevel} · {state.currentLevel === 1 ? 'BASIC MONOLITH' : 'MODULAR MONOLITH'}</span><span>Quedan {state.remainingTime} unidades</span><span>PO +10 por cada ticket entregado · −1 por unidad gastada</span></div></section>
      {state.status !== 'playing' && <div className="game-overlay"><div className="finish-content"><span className="overlay-icon">{state.status === 'won' ? '✦' : '◇'}</span><h2>{state.status === 'won' ? '¡Entrega completa!' : 'La partida terminó'}</h2><p>{state.status === 'won' ? 'Los cinco tickets están completos. Revisá cómo quedó la arquitectura y qué aprendió el equipo.' : state.remainingTime <= 0 ? 'Se agotó el presupuesto de trabajo.' : `Un área del equipo perdió la confianza: PO ${state.stakeholders.po}% · QA ${state.stakeholders.qa}% · Infra ${state.stakeholders.infra}%.`}</p><p>Score final: <strong>{state.score + metrics.score}</strong> · tickets entregados: <strong>{state.completedTickets.length}/{tickets.length}</strong></p><button className="game-primary-button" onClick={reset}>Nueva partida</button></div></div>}
      </section>
      {feedback && state.status === 'playing' && <div className="game-toast" role="status"><p>{feedback}</p><button onClick={() => setFeedback('')} aria-label="Cerrar">×</button></div>}
    </main></>;
}
export default function MonolithGame() { return <ReactFlowProvider><MonolithGameContent /></ReactFlowProvider>; }
