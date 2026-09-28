import { motion } from "framer-motion";
import  type{ Company } from "./types";
import LogoImage from "./LogoImage";

interface Props {
  companies: Company[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function CompanyTimeline({
  companies,
  currentIndex,
  onSelect,
}: Props) {
  return (
    <div className="company-timeline">
      <div className="company-timeline-scroll">
        {companies.map((company, index) => {
          const active = index === currentIndex;
          const visited = index < currentIndex;

          return (
            <div
              key={company.id}
              className="company-timeline-item"
            >
              <button
                onClick={() => onSelect(index)}
                className="company-timeline-button"
              >
                {/* Círculo */}
                <motion.div
                  animate={{
                    scale: active ? 1.15 : 1,
                    backgroundColor: active
                      ? company.primaryColor
                      : visited
                      ? company.primaryColor
                      : "#D1D5DB",
                    borderColor: company.primaryColor,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="company-timeline-logo"
                >
                  <LogoImage
                    src={company.logo}
                    alt={company.company}
                    fallback={company.company.slice(0, 1)}
                    className="company-timeline-logo-image"
                    fallbackClassName="company-timeline-logo-fallback"
                  />

                  {active && (
                    <motion.div
                      layoutId="company-indicator"
                      className="absolute inset-0 rounded-full ring-4 ring-white"
                    />
                  )}
                </motion.div>

                {/* Nombre */}
                <motion.span
                  animate={{
                    color: active
                      ? company.primaryColor
                      : "#6B7280",
                    fontWeight: active ? 700 : 500,
                  }}
                  className="company-timeline-name"
                >
                  {company.company}
                </motion.span>

                {/* Período */}
                <span className="company-timeline-period">
                  {company.from} - {company.to}
                </span>
              </button>

              {/* Línea */}
              {index < companies.length - 1 && (
                <div className="company-timeline-connector">
                  <motion.div
                    initial={false}
                    animate={{
                      width:
                        visited
                          ? "100%"
                          : active
                          ? "50%"
                          : "0%",
                      backgroundColor: company.primaryColor,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="company-timeline-connector-progress"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
