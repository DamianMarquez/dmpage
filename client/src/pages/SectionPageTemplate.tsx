import ButtonLink from '../components/ButtonLink';

type Props = {
  sectionTitle: string;
};

export default function SectionPageTemplate({ sectionTitle }: Props) {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{sectionTitle}</h1>
      <div style={{ fontSize: '1.5rem', margin: '2rem 0' }}>
        Under Construction
      </div>
      <p>The page for this section is under development.</p>
      <ButtonLink to="/" label="Back to Home" />
    </section>
  );
}
