import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../seo/SeoHead';
import { architectureLanes, architectureLessons, fallingComponents } from './hexagonalDefenderData';
import './games.css';

type GameStatus = 'ready' | 'playing' | 'paused' | 'feedback' | 'finished';

export default function HexagonalDefender() {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [laneIndex, setLaneIndex] = useState(0);
  const [componentIndex, setComponentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [finishAfterFeedback, setFinishAfterFeedback] = useState(false);
  const laneIndexRef = useRef(laneIndex);
  const progressRef = useRef(0);
  const component = fallingComponents[componentIndex];
  const selectedLane = architectureLanes[laneIndex];
  const laneCenter = `${((laneIndex + 0.5) / architectureLanes.length) * 100}%`;

  const move = useCallback((direction: number) => {
    const nextIndex = (laneIndexRef.current + direction + architectureLanes.length) % architectureLanes.length;
    laneIndexRef.current = nextIndex;
    setLaneIndex(nextIndex);
  }, []);

  const selectLane = (index: number) => {
    laneIndexRef.current = index;
    setLaneIndex(index);
  };

  const restart = () => {
    setComponentIndex(0);
    setLaneIndex(0);
    setProgress(0);
    laneIndexRef.current = 0;
    progressRef.current = 0;
    setScore(0);
    setLives(3);
    setFeedback(null);
    setFinishAfterFeedback(false);
    setStatus('playing');
  };

  useEffect(() => {
    if (status !== 'playing') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) event.preventDefault();
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') move(-1);
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') move(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, move]);

  useEffect(() => {
    if (status !== 'playing') return;
    const duration = 6500;
    let frame = 0;
    const startTime = performance.now() - (progressRef.current / 100) * duration;
    const animate = (now: number) => {
      const nextProgress = Math.min(100, ((now - startTime) / duration) * 100);
      progressRef.current = nextProgress;
      setProgress(nextProgress);
      if (nextProgress < 100) {
        frame = window.requestAnimationFrame(animate);
        return;
      }

      const correct = architectureLanes[laneIndexRef.current].id === component.laneId;
      const answer = architectureLanes.find((lane) => lane.id === component.laneId)!;
      if (correct) setScore((current) => current + 100);
      else setLives((current) => current - 1);
      setFeedback({
        correct,
        message: correct
          ? `${component.name} va en ${answer.label}. ${component.explanation}`
          : `${component.name} pertenece a ${answer.label}. ${component.explanation}`,
      });
      const isLast = componentIndex === fallingComponents.length - 1;
      setFinishAfterFeedback(isLast || (!correct && lives <= 1));
      setStatus('feedback');
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [status, componentIndex, component, lives]);

  useEffect(() => {
    if (status !== 'feedback') return;
    const timer = window.setTimeout(() => {
      if (finishAfterFeedback) {
        setStatus('finished');
      } else {
        setComponentIndex((current) => current + 1);
        setProgress(0);
        progressRef.current = 0;
        setFeedback(null);
        setStatus('playing');
      }
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [status, finishAfterFeedback]);

  return (
    <>
      <SeoHead page="hexagonalDefender" />
      <Navbar user={null} onOpenLogin={() => undefined} showAuthControls={false} />
      <main className="games-page defender-page">
        <div className="defender-heading">
          <Link className="games-back-link" to="/games">← Todos los juegos</Link>
          <p className="games-eyebrow">JUEGO 01 · ARQUITECTURA</p>
          <h1>Hexagonal Defender</h1>
          <p>Mové tu nave al carril donde pertenece cada componente antes de que llegue al núcleo.</p>
        </div>

        <section className="defender-shell" aria-label="Partida de Hexagonal Defender">
          <div className="game-hud">
            <div><span>PUNTAJE</span><strong>{score.toString().padStart(4, '0')}</strong></div>
            <div><span>COMPONENTE</span><strong>{Math.min(componentIndex + 1, fallingComponents.length)} / {fallingComponents.length}</strong></div>
            <div><span>ENERGÍA</span><strong className="game-lives">{'◆ '.repeat(lives)}{'◇ '.repeat(3 - lives)}</strong></div>
            {(status === 'playing' || status === 'paused') && (
              <button className="game-small-button" onClick={() => setStatus(status === 'playing' ? 'paused' : 'playing')}>
                {status === 'playing' ? 'Ⅱ Pausar' : '▶ Continuar'}
              </button>
            )}
          </div>

          <div className={`defender-board ${status === 'paused' ? 'is-paused' : ''}`}>
            <div className="board-stars" aria-hidden="true">✦ · ✧ · ✦ · ✧</div>
            <div className="falling-track" aria-hidden="true" style={{ left: laneCenter }} />
            {(status === 'playing' || status === 'feedback') && component && (
              <div className="falling-component" style={{ top: `${8 + progress * 0.57}%`, left: laneCenter }}>
                <span>{component.kind}</span><strong>{component.name}</strong>
              </div>
            )}
            <div className="lane-grid" role="group" aria-label="Elegí una zona arquitectónica">
              {architectureLanes.map((lane, index) => (
                <button
                  key={lane.id}
                  type="button"
                  className={`architecture-lane ${index === laneIndex ? 'is-selected' : ''} ${feedback && feedback.correct && lane.id === component.laneId ? 'is-correct' : ''}`}
                  onClick={() => selectLane(index)}
                  aria-pressed={index === laneIndex}
                  disabled={status === 'paused' || status === 'ready' || status === 'finished' || status === 'feedback'}
                >
                  <span className="lane-code">{lane.shortLabel}</span>
                  <strong>{lane.label}</strong>
                  <small>{lane.description}</small>
                  {index === laneIndex && <span className="player-ship" aria-label="Tu nave">▲</span>}
                </button>
              ))}
            </div>

            {status === 'ready' && <div className="game-overlay"><div><span className="overlay-icon">⬡</span><h2>Defendé la arquitectura</h2><p>Movete entre los seis carriles y ubicá cada componente en su zona correcta.</p><button className="game-primary-button" onClick={restart}>Iniciar partida</button></div></div>}
            {status === 'paused' && <div className="game-overlay"><div><span className="overlay-icon">Ⅱ</span><h2>Partida en pausa</h2><p>La arquitectura espera. Cuando quieras, retomamos.</p><button className="game-primary-button" onClick={() => setStatus('playing')}>Continuar</button></div></div>}
            {status === 'feedback' && feedback && <div className={`game-feedback ${feedback.correct ? 'feedback-correct' : 'feedback-wrong'}`} role="status"><strong>{feedback.correct ? '¡Correcto! +100' : 'Carril incorrecto'}</strong><p>{feedback.message}</p></div>}
            {status === 'finished' && <div className="game-overlay"><div><span className="overlay-icon">{lives > 0 ? '✦' : '◇'}</span><h2>{lives > 0 ? '¡Arquitectura defendida!' : 'Fin de la partida'}</h2><p>Sumaste <strong>{score}</strong> puntos. {score >= fallingComponents.length * 100 ? '¡Dominás los puertos y adapters!' : 'Cada error también enseña: repasá los carriles e intentá otra vez.'}</p><button className="game-primary-button" onClick={restart}>Jugar de nuevo</button></div></div>}
          </div>

          <div className="game-controls">
            <div className="move-buttons"><button aria-label="Carril anterior" onClick={() => move(-1)} disabled={status !== 'playing'}>←</button><span>Flechas o A / D</span><button aria-label="Carril siguiente" onClick={() => move(1)} disabled={status !== 'playing'}>→</button></div>
            <p>Zona seleccionada: <strong>{selectedLane.label}</strong></p>
            <button className="game-small-button" onClick={restart}>↻ Reiniciar</button>
          </div>
        </section>

        <section className="learning-panel">
          <h2>Cómo se conectan las zonas</h2>
          <div className="dependency-flow"><span>Input Adapter</span><b>→</b><span>Input Port</span><b>→</b><span>Application Service</span><b>→</b><span>Output Port</span><b>→</b><span>Output Adapter</span></div>
          <ul>{architectureLessons.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul>
          <p className="domain-note"><strong>Domain / Core:</strong> Entidades, Value Objects y reglas de negocio puras. El dominio no depende de adapters.</p>
        </section>
      </main>
    </>
  );
}
