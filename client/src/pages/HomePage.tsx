import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';

import { useIntersectionAnimation } from '../hooks/useIntersectionAnimation';

export default function HomePage() {
  useIntersectionAnimation('.exp-item, .skill-card');

  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Escuchar el estado de autenticación de Supabase
  useEffect(() => {
    // 1. Obtener sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar user={user} onOpenLogin={() => setIsLoginOpen(true)} />

      <main>
        <Hero />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}