import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

import { useIntersectionAnimation } from '../hooks/useIntersectionAnimation';

export default function HomePage() {
  useIntersectionAnimation('.exp-item, .skill-card');

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}