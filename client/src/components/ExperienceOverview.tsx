import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import SectionHeader from "./SectionHeader";
import { companies } from "./carrousel/experienceData";
import "./carrousel/Experience.css";

const stats = [
  { value: "18+", label: "años de experiencia" },
  { value: "36+", label: "developers mentoreados" },
  { value: "6", label: "waves de formación" },
  { value: "5", label: "contextos profesionales" },
];

export default function ExperienceOverview() {
  return (
    <section id="experience" className="experience-overview">
      <SectionHeader index="02" title="Experience" />

      <div className="experience-overview-heading">
        <div>
          <h2>Career Journey</h2>
          <p>
            Desarrollo sistemas, acompaño equipos y convierto problemas complejos
            en soluciones que pueden crecer.
          </p>
        </div>
        <Link className="experience-overview-link" to="/sections/experience">
          Ver recorrido completo <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="experience-overview-stats">
        {stats.map((stat) => (
          <div className="experience-overview-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="experience-overview-grid">
        {companies.map((company) => (
          <article
            className="experience-overview-card"
            key={company.id}
            style={{ "--company-accent": company.primaryColor } as CSSProperties}
          >
            <div className="experience-overview-card-topline">
              <span>{company.from} — {company.to}</span>
              <span>{company.location}</span>
            </div>
            <h3>{company.company}</h3>
            {company.client && <p className="experience-overview-client">{company.client}</p>}
            <p className="experience-overview-role">{company.role}</p>
            <p className="experience-overview-summary">{company.summary}</p>
            <div className="experience-overview-tags">
              {company.projects[0].technologies.slice(0, 5).map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
