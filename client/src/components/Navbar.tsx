import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
}

export default function Navbar({ user, onOpenLogin }: NavbarProps) {
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

  return (
    <nav>
      <a href="#hero" className="nav-logo">
        DM<span>.</span>
      </a>

      <ul className="nav-links">
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
    </nav>
  );
}