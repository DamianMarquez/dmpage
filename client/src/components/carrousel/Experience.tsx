import Background from "./Background";
import CompanyHeader from "./CompanyHeader";
import CompanyTimeline from "./CompanyTimeline";
import Navigation from "./Navigation";
import ProgressBar from "./ProgressBar";
import ProjectCard from "./ProjectCard";
import ProjectTimeline from "./ProjectTimeline";
import useExperience from "./useExperience";
import  type{ Company } from "./types";
import "./Experience.css";

interface Props {
  companies: Company[];
}

export default function Experience({
  companies,
}: Props) {
  const {
    company,
    project,

    companyIndex,
    projectIndex,

    totalProjects,
    globalProjectIndex,

    next,
    previous,

    first,
    last,

    goToCompany,
    goToProject,

    swipeHandlers,
  } = useExperience({
    companies,
  });

  return (
    <section
      {...swipeHandlers}
      className="experience-carousel-section"
    >
      <Background
        primaryColor={company.primaryColor}
        secondaryColor={company.secondaryColor}
      >
        <div className="experience-carousel-content">

          {/* Header */}

          <header>

            <h1 className="experience-carousel-title">
              Mi experiencia profesional
            </h1>

            <p className="experience-carousel-intro">
              Un recorrido por las empresas y proyectos
              en los que participé durante mi carrera.
            </p>

          </header>

          {/* Timeline empresas */}

          <CompanyTimeline
            companies={companies}
            currentIndex={companyIndex}
            onSelect={goToCompany}
          />

          {/* Empresa */}

          <CompanyHeader
            company={company}
          />

          {/* Barra progreso */}

          <ProgressBar
            current={globalProjectIndex}
            total={totalProjects}
            primaryColor={company.primaryColor}
          />

          {/* Timeline proyectos */}

          <ProjectTimeline
            projects={company.projects}
            currentIndex={projectIndex}
            primaryColor={company.primaryColor}
            onSelect={goToProject}
          />

          {/* Proyecto */}

          <ProjectCard
            project={project}
            primaryColor={company.primaryColor}
          />

          {/* Navegación */}

          <Navigation
            onPrevious={previous}
            onNext={next}
            onFirst={first}
            onLast={last}
            disablePrevious={
              companyIndex === 0 &&
              projectIndex === 0
            }
            disableNext={
              companyIndex === companies.length - 1 &&
              projectIndex ===
                company.projects.length - 1
            }
            primaryColor={company.primaryColor}
          />

        </div>
      </Background>
    </section>
  );
}
