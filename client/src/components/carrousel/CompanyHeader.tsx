import { Card } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { motion, AnimatePresence } from "framer-motion";
import { companyAnimation } from "./animations";
import  type{ Company } from "./types";
import LogoImage from "./LogoImage";

interface Props {
  company: Company;
}

export default function CompanyHeader({ company }: Props) {
  return (
    <div className="company-header-wrapper">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={company.id}
          className="company-header-animation"
          variants={companyAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card
            elevation={0}
            className="company-header-card"
            sx={{
              backgroundColor: "rgba(17, 17, 24, 0.78)",
              color: "var(--text)",
            }}
          >
              <div className="company-header-content">
              {/* Logo */}
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 2,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="company-header-logo-column"
              >
                <div
                  className="company-header-logo-box"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${company.primaryColor},
                      ${company.secondaryColor}
                    )`,
                  }}
                >
                  <LogoImage
                    src={company.logo}
                    alt={company.company}
                    fallback={company.company.slice(0, 1)}
                    className="company-header-logo"
                    fallbackClassName="company-header-logo-fallback"
                  />
                </div>
              </motion.div>

              {/* Información */}
              <div className="company-header-info">
                <motion.h1
                  layout
                  className="company-header-company"
                >
                  {company.company}
                </motion.h1>

                {company.client && (
                  <p className="company-header-client">{company.client}</p>
                )}

                <motion.h2
                  layout
                  className="company-header-role"
                >
                  {company.role}
                </motion.h2>

                <motion.p
                  layout
                  className="company-header-period"
                >
                  {company.from} — {company.to}
                </motion.p>

                {company.location && (
                  <p className="company-header-location">{company.location}</p>
                )}

                {company.website && (
                  <motion.a
                    whileHover={{
                      scale: 1.05,
                    }}
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-header-website"
                    style={{
                      color: company.primaryColor,
                    }}
                  >
                    <LanguageIcon fontSize="small" />
                    Sitio web
                  </motion.a>
                )}
              </div>

              {/* Banda lateral */}
              <div className="company-header-side-band">
                <div
                  className="company-header-side-band-fill"
                  style={{
                    background: `linear-gradient(
                      to bottom,
                      ${company.primaryColor},
                      ${company.secondaryColor}
                    )`,
                  }}
                />
              </div>
            </div>

            <div className="company-header-details">
              <p className="company-header-summary">{company.summary}</p>
              <ul className="company-header-highlights">
                {company.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
