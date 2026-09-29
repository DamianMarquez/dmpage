import SectionPageTemplate from '../SectionPageTemplate';
import SeoHead from '../../seo/SeoHead';

export default function ContactPage() {
  return (
    <>
      <SeoHead page="contact" />
      <SectionPageTemplate sectionTitle="Contacto">
        <p>
          Estoy abierto a oportunidades remotas, consultoría, arquitectura de
          software, mentoring técnico y colaboraciones interesantes.
        </p>
        <p>
          Trabajo desde Buenos Aires, Argentina, con equipos distribuidos y
          proyectos internacionales.
        </p>
        <p>
          Email:{" "}
          <a href="mailto:marquez.damian@outlook.com">
            marquez.damian@outlook.com
          </a>
        </p>
        <p>
          Perfil profesional:{" "}
          <a
            href="https://www.linkedin.com/in/marquez-damian"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </SectionPageTemplate>
    </>
  );
}
