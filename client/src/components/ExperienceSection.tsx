import ButtonLink from './ButtonLink';
import SectionHeader from './SectionHeader';

interface Experience {
  company: string;
  companyDetail?: string;
  period: string;
  role: string;
  description: string;
  tags: {
    label: string;
    variant?: string;
  }[];
}

const experiences: Experience[] = [
  {
    company: 'Teamcubation',
    period: 'Dec 2022 – Present · 3y 5m',
    role: 'Squad Senior — GoLang / Java · Tech Mentor',
    description:
      'Led a long-term talent development program across 6 waves, mentoring 36+ junior developers from entry-level to near Semi-Senior through technical coaching, code reviews, architectural guidance, and real project delivery. Designed learning paths centered on GoLang, Java, TypeScript, and React. In parallel, launched BoostersAI — a mentoring initiative for non-IT professionals, conducting multiple training cycles on Power Automate, Copilot Studio, and N8N.',
    tags: [
      { label: 'Go', variant: 'go' },
      { label: 'Java', variant: 'java' },
      { label: 'Spring Boot', variant: 'java' },
      { label: 'React', variant: 'react' },
      { label: 'TypeScript', variant: 'react' },
      { label: 'Docker' },
      { label: 'MongoDB' },
      { label: 'RabbitMQ' },
      { label: 'Node.js' },
      { label: 'Power Automate' },
      { label: 'N8N' },
    ],
  },

  {
    company: 'Globant',
    companyDetail: '/ Cabify',
    period: 'Apr 2021 – Nov 2022 · 1y 8m',
    role: 'Full Stack GoLang / Java Developer SSR',
    description:
      'Worked embedded in Cabify\'s COPs team on driver acquisition systems. Developed the Harvey system (harassment request processing + Zendesk ticketing), multiple middleware services for data centralization using gRPC and message queues, and a reservations message-filtering service. Continued the habit of coaching and onboarding teammates, helping junior members navigate the codebase and ramp up quickly.',
    tags: [
      { label: 'Go', variant: 'go' },
      { label: 'Java', variant: 'java' },
      { label: 'Groovy' },
      { label: 'Node.js' },
      { label: 'Docker' },
      { label: 'Google Cloud Run' },
      { label: 'Kibana' },
      { label: 'Zendesk' },
    ],
  },

  {
    company: 'Baufest',
    companyDetail: '/ BBVA',
    period: 'Feb 2020 – Apr 2021 · 1y 3m',
    role: 'Full Stack Java Developer SSR',
    description:
      'Full stack development for BBVA, working with Java 1.6/1.8, Spring Boot, Go, Kotlin, and JavaScript. Beyond the technical work, participated as Gaming Interest Group Leader, Baufest Ambassador, and led two onboarding processes for new team members — a recurring pattern across every role: finding opportunities to bring people in and push them forward.',
    tags: [
      { label: 'Java', variant: 'java' },
      { label: 'Spring Boot', variant: 'java' },
      { label: 'Go', variant: 'go' },
      { label: 'Kotlin' },
      { label: 'MS-SQL' },
      { label: 'Postgres' },
    ],
  },

  {
    company: 'ADAMAT S.A.',
    period: 'Apr 2017 – Feb 2020 · 2y 11m',
    role: 'Systems Administration Manager',
    description:
      'Led the Systems and Administration area with full P&L and organizational responsibility. Planned short and long-term objectives, directed the technical team, and advised on hiring, training, and company-wide process improvements.',
    tags: [
      { label: 'Systems Management' },
      { label: 'Team Leadership' },
      { label: 'Strategic Planning' },
    ],
  },

  {
    company: 'The Coca-Cola Company',
    period: 'Dec 2006 – Apr 2017 · 10y 5m',
    role: 'Business Intelligence Project Lead — LATAM',
    description:
      'Over a decade leading BI initiatives across South Latin and Latin Center regions (Argentina, Chile, Peru, Bolivia, Paraguay, Uruguay, Mexico). Spearheaded database migrations (MSSQL 2000 → 2005 → Global), BI tool implementations with QlikView, Value Chain Analysis tool rollout, data unification across countries, and grew the support area from 1 to 4 resources.',
    tags: [
      { label: 'MS-SQL' },
      { label: 'QlikView' },
      { label: '.NET' },
      { label: 'BI' },
      { label: 'LATAM' },
      { label: 'Data Migration' },
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience">

      <SectionHeader
        index="02"
        title="Experience"
      />

      <h2>Career Journey</h2>

      <div className="timeline">

        {experiences.map((exp) => (

          <div
            key={exp.company}
            className="exp-item"
          >

            <div className="exp-dot"></div>

            <div className="exp-header">

              <div className="exp-company">

                {exp.company}

                {exp.companyDetail && (
                  <span className="exp-company-detail">
                    {exp.companyDetail}
                  </span>
                )}

              </div>

              <div className="exp-period">
                {exp.period}
              </div>

            </div>

            <div className="exp-role">
              {exp.role}
            </div>

            <div className="exp-desc">
              {exp.description}
            </div>

            <div className="tag-row">

              {exp.tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`tag ${tag.variant || ''}`}
                >
                  {tag.label}
                </span>
              ))}

            </div>

          </div>

        ))}

      </div>

<ButtonLink to="/sections/experience" label="Ver Más" />
    </section>
  );
}