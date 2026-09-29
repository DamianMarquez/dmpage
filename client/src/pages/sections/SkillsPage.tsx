import SectionPageTemplate from '../SectionPageTemplate';
import SeoHead from '../../seo/SeoHead';
import { Link } from 'react-router-dom';

export default function SkillsPage() {
  return (
    <>
      <SeoHead page="skills" />
      <SectionPageTemplate sectionTitle="Skills y tecnologías">
        <p>
          Trabajo como desarrollador Full Stack Senior y mentor técnico,
          diseñando soluciones mantenibles para productos y equipos en
          crecimiento.
        </p>
        <h2>Áreas de expertise</h2>
        <ul>
          <li>Backend y sistemas distribuidos con Go, Java, Spring Boot y Node.js.</li>
          <li>Interfaces modernas con React, TypeScript, JavaScript y Vite.</li>
          <li>APIs, gRPC, mensajería, bases de datos relacionales y NoSQL.</li>
          <li>Docker, Google Cloud Run, CI/CD, AI y automatización de procesos.</li>
          <li>Arquitectura, code review, liderazgo técnico y mentoring.</li>
        </ul>
        <p>
          Para ver estas tecnologías aplicadas en proyectos reales, visitá la{" "}
          <Link to="/sections/experience">experiencia profesional</Link>.
        </p>
      </SectionPageTemplate>
    </>
  );
}
