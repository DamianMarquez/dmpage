import SectionHeader from './SectionHeader';

import ButtonLink from '../components/ButtonLink';

interface SkillCategory {
  icon: string;
  title: string;
  description: string;
  tags: {
    label: string;
    variant?: string;
  }[];
}

const skills: SkillCategory[] = [
  {
    icon: '⚙️',
    title: 'Backend',
    description:
      'Specialized in high-performance server-side systems and microservices.',
    tags: [
      { label: 'Go', variant: 'go' },
      { label: 'Java', variant: 'java' },
      { label: 'Spring Boot', variant: 'java' },
      { label: 'Node.js' },
      { label: 'gRPC' },
      { label: 'REST APIs' },
    ],
  },

  {
    icon: '🎨',
    title: 'Frontend',
    description:
      'Building modern, type-safe interfaces with component-driven architecture.',
    tags: [
      { label: 'React', variant: 'react' },
      { label: 'TypeScript', variant: 'react' },
      { label: 'Vite' },
      { label: 'HTML/CSS' },
      { label: 'JavaScript' },
    ],
  },

  {
    icon: '🗄️',
    title: 'Data & Messaging',
    description:
      'Experience with both relational and NoSQL databases and async messaging.',
    tags: [
      { label: 'MongoDB' },
      { label: 'SQL Server' },
      { label: 'PostgreSQL' },
      { label: 'RabbitMQ' },
      { label: 'QlikView' },
    ],
  },

  {
    icon: '☁️',
    title: 'DevOps & Cloud',
    description:
      'Containerization, CI/CD and cloud deployment across major providers.',
    tags: [
      { label: 'Docker' },
      { label: 'Google Cloud Run' },
      { label: 'GitLab CI' },
      { label: 'OKTA' },
    ],
  },

  {
    icon: '🤖',
    title: 'AI & Automation',
    description:
      'A lifelong passion — from scripting repetitive tasks years ago to leveraging today’s AI leap to compress months of work into days.',
    tags: [
      { label: 'Power Automate' },
      { label: 'Copilot Studio' },
      { label: 'N8N' },
      { label: 'Low-code' },
    ],
  },

  {
    icon: '🧑‍🏫',
    title: 'Leadership & Mentoring',
    description:
      'Coaching developers, running onboardings, and helping teams grow while respecting work-life balance.',
    tags: [
      { label: 'Technical Mentoring' },
      { label: 'Code Review' },
      { label: 'Architecture' },
      { label: 'Team Lead' },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills">

      <SectionHeader
        index="03"
        title="Skills"
      />

      <h2>Tech Stack</h2>

      <div className="skills-grid">

        {skills.map((skill) => (

          <div
            key={skill.title}
            className="skill-card"
          >

            <div className="skill-card-icon">
              {skill.icon}
            </div>

            <div className="skill-card-title">
              {skill.title}
            </div>

            <p className="skill-card-description">
              {skill.description}
            </p>

            <div className="skill-card-tags">

              {skill.tags.map((tag) => (
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
        <div style={{ marginTop: '1rem' }}>
          <ButtonLink to="/sections/skills" label="Ver Más" />
        </div>
    </section>
  );
}