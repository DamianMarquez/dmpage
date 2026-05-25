import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import './Navbar.css'

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
}

import { useEffect, useState } from 'react';

export default function Navbar({ user, onOpenLogin }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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
      <a href="#hero" className="nav-logo">
        DM<span>.</span>
      </a>
      {/* Desktop links */}
      <ul className="nav-links" aria-label="Main navigation" >
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="/blog">Blog</a></li>
        {user ? (
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
        )}
      </ul>
      {/* Mobile menu toggle */}
      <button aria-label="Open menu" className="btn-nav-login menu-toggle" onClick={toggleMenu}>
        Menu
      </button>
      {menuOpen && (
        <ul className="mobile-menu" aria-label="Mobile navigation" >
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a></li>
          <li><a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          <li><a href="/blog" onClick={() => setMenuOpen(false)}>Blog</a></li>
          {user ? (
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
          )}
        </ul>
      )}
    </nav>
  );
}