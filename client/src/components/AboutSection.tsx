import SectionHeader from './SectionHeader';

const details = [
  {
    icon: '📍',
    label: 'Location',
    value: 'Buenos Aires, Argentina',
  },
  {
    icon: '💼',
    label: 'Current Role',
    value: 'Squad Senior at Teamcubation',
  },
  {
    icon: '🌐',
    label: 'Languages',
    value: 'Spanish (Native) · English (Professional)',
  },
  {
    icon: '🎯',
    label: 'Availability',
    value: 'Open to remote opportunities',
  },
  {
    icon: '🚀',
    label: 'Focus Areas',
    value: 'GoLang · Mentoring · AI Automation',
  },
];

export default function AboutSection() {
  return (
    <section id="about">
      <SectionHeader index="01" title="About" />

      <h2>
        Turning complexity
        <br />
        into clarity
      </h2>

      <div className="about-grid">

        <div className="about-text">

          <p>
          I started programming at <strong>15</strong> — long before it was a career plan. That early obsession with making machines do things automatically never really left. It just evolved.
          </p>

          <p>
            Over 18+ years I've worked across {''}
            <strong>intech, mobility, BI, and enterprise</strong> environments, always gravitating toward the same thing: finding better ways to build, and helping the people around me grow alongside the work. Throughout every company I've been part of, I've naturally taken on mentoring and coaching roles — onboarding new developers, pushing them toward their potential while being mindful of the balance between professional growth and personal life. That balance matters to me as much as the code.
          </p>

          <p>
          Automation and AI have been a constant thread. I was that person automating repetitive tasks before it had a cool name. Now, with the current leap in AI capabilities, what used to take months can happen in days — and I find that genuinely exciting, not threatening. Through  {''}
            <strong>BoostersAI</strong> {''} I've been helping non-IT professionals tap into that same energy: making powerful tools accessible to everyone, not just developers.
          </p>

        </div>

        <div className="about-details">

          {details.map((detail) => (
            <div key={detail.label} className="detail-item">

              <div className="detail-icon">
                {detail.icon}
              </div>

              <div>
                <div className="detail-label">
                  {detail.label}
                </div>

                <div className="detail-value">
                  {detail.value}
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}