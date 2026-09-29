import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../seo/SeoHead';
import './games.css';

export default function GamesPage() {
  return (
    <>
      <SeoHead page="games" />
      <Navbar user={null} onOpenLogin={() => undefined} showAuthControls={false} />
      <main className="games-page">
        <header className="games-heading">
          <p className="games-eyebrow">Arcade de aprendizaje</p>
          <h1>🎮 Juegos</h1>
          <p>Aprendé conceptos de software jugando. Elegí un desafío y defendé tus ideas.</p>
        </header>
        <article className="game-card">
          <div className="game-card-art" aria-hidden="true"><span>⬡</span><i>✦</i><b>✧</b></div>
          <div className="game-card-copy">
            <span className="game-card-tag">ARQUITECTURA · 5 MIN</span>
            <h2>Hexagonal Defender</h2>
            <p>Defendé tu arquitectura. Identificá dónde pertenece cada componente de una Arquitectura Hexagonal.</p>
            <Link className="game-primary-button" to="/games/hexagonal-defender">Iniciar juego <span aria-hidden="true">→</span></Link>
          </div>
        </article>
      </main>
    </>
  );
}
