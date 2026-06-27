import ButtonLink from '../components/ButtonLink';
import React from 'react';

type Props = {
  sectionTitle: string;
  children?: React.ReactNode;
};

export default function SectionPageTemplate({ sectionTitle, children }: Props) {
  return (
    <div>
      {/* Floating back-to-home button fixed to the top of the viewport */}
      <div className="floating-back-top-wrap" aria-label="Back to Home">
        <ButtonLink to="/" label="Back to Home" />
      </div>
      {/* Main content section offset to avoid being hidden under the fixed button */}
      <section style={{ padding: '2rem', paddingTop: '70px', textAlign: 'center' }}>
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
      </section>
    </div>
  );
}
