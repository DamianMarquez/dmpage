import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import './Navbar.css'

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
  showAuthControls?: boolean;
}

import { useEffect, useState } from 'react';

export default function Navbar({ user, onOpenLogin, showAuthControls = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const homePath = window.location.pathname === '/' ? '' : '/';
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
      }
    } catch (err) {
      console.error('Error de red al cerrar sesión:', err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
  };

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setMenuOpen(false);
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

  return (
    <nav>
      <a href={`${homePath}#hero`} className="nav-logo">
        DM<span>.</span>
      </a>
      {/* Desktop links */}
      <ul className="nav-links" aria-label="Main navigation" >
        <li><a href={`${homePath}#about`}>About</a></li>
        <li><a href={`${homePath}#experience`}>Experience</a></li>
        <li><a href={`${homePath}#skills`}>Skills</a></li>
        <li><a href={`${homePath}#contact`}>Contact</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/games">🎮 Juegos</a></li>
        {showAuthControls && (user ? (
          <li className="nav-user-item">
            <span className="user-email" title={user.email}>
              {user.email?.split('@')[0]}
            </span>
            <button onClick={handleLogout} className="btn-nav-logout">
              Salir
            </button>
          </li>
        ) : (
          <li>
            <button onClick={onOpenLogin} className="btn-nav-login">
              Login
            </button>
          </li>
        ))}
      </ul>
      {/* Mobile menu toggle */}
      <button aria-label="Open menu" className="btn-nav-login menu-toggle" onClick={toggleMenu}>
        Menu
      </button>
      {menuOpen && (
        <ul className="mobile-menu" aria-label="Mobile navigation" >
          <li><a href={`${homePath}#about`} onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href={`${homePath}#experience`} onClick={() => setMenuOpen(false)}>Experience</a></li>
          <li><a href={`${homePath}#skills`} onClick={() => setMenuOpen(false)}>Skills</a></li>
          <li><a href={`${homePath}#contact`} onClick={() => setMenuOpen(false)}>Contact</a></li>
          <li><a href="/blog" onClick={() => setMenuOpen(false)}>Blog</a></li>
          <li><a href="/games" onClick={() => setMenuOpen(false)}>🎮 Juegos</a></li>
          {showAuthControls && (user ? (
            <li className="nav-user-item" style={{ marginTop: '0.5rem' }}>
              <span className="user-email" title={user.email}>
                {user.email?.split('@')[0]}
              </span>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-nav-logout">Salirte</button>
            </li>
          ) : (
            <li>
              <button onClick={() => { onOpenLogin(); setMenuOpen(false); }} className="btn-nav-login" style={{ marginTop: '0.5rem' }}>Login</button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
