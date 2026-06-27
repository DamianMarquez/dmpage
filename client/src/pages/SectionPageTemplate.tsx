import ButtonLink from '../components/ButtonLink';
import React from 'react';

type Props = {
  sectionTitle: string;
  children?: React.ReactNode;
};

export default function SectionPageTemplate({ sectionTitle, children }: Props) {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{sectionTitle}</h1>
      {children ? (
        <div style={{ fontSize: '1.5rem', margin: '2rem 0', textAlign: 'left' }}>
          {children}
        </div>
      ) : (
        <div style={{ fontSize: '1.5rem', margin: '2rem 0' }}>
          Under Construction
        </div>
      )}
      {!children && <p>The page for this section is under development.</p>}
      <ButtonLink to="/" label="Back to Home" />
    </section>
  );
}
