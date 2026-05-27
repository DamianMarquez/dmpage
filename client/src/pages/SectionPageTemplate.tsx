import ButtonLink from '../components/ButtonLink';

type Props = {
  sectionTitle: string;
};

export default function SectionPageTemplate({ sectionTitle }: Props) {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{sectionTitle}</h1>
      <div style={{ fontSize: '1.5rem', margin: '2rem 0' }}>
        En construcción
      </div>
      <p>La página de esta sección está en desarrollo.</p>
      <ButtonLink to="/" label="Volver a Inicio" />
    </section>
  );
}
