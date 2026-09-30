import { createBrowserRouter } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AboutPage from '../pages/sections/AboutPage';
import ExperiencePage from '../pages/sections/ExperiencePage';
import SkillsPage from '../pages/sections/SkillsPage';
import ContactPage from '../pages/sections/ContactPage';
import GamesPage from '../pages/games/GamesPage';
import HexagonalDefender from '../pages/games/HexagonalDefender';
import MonolithRoute from '../games/monolith/MonolithRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sections/about',
    element: <AboutPage />,
  },
  {
    path: '/sections/experience',
    element: <ExperiencePage />,
  },
  {
    path: '/sections/skills',
    element: <SkillsPage />,
  },
  {
    path: '/sections/contact',
    element: <ContactPage />,
  },
  {
    path: '/games',
    element: <GamesPage />,
  },
  {
    path: '/games/hexagonal-defender',
    element: <HexagonalDefender />,
  },
  {
    path: '/games/monolith-mayhem',
    element: <MonolithRoute />,
  },
]);
