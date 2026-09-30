import { lazy, Suspense } from 'react';

const MonolithGame = lazy(() => import('./MonolithGame'));

export default function MonolithRoute() {
  return <Suspense fallback={<main className="games-page"><p>Cargando Monolith Mayhem…</p></main>}><MonolithGame /></Suspense>;
}
