import { Card } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import BusinessIcon from "@mui/icons-material/Business";
import { motion, AnimatePresence } from "framer-motion";
import { companyAnimation } from "./animations";
import  type{ Company } from "./types";

interface Props {
  company: Company;
}

export default function CompanyHeader({ company }: Props) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={company.id}
          variants={companyAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card
            elevation={0}
            className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-8 p-8">
              {/* Logo */}
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 2,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="flex justify-center md:justify-start"
              >
                <div
                  className="h-28 w-28 rounded-3xl flex items-center justify-center shadow-xl"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${company.primaryColor},
                      ${company.secondaryColor}
                    )`,
                  }}
                >
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.company}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <BusinessIcon
                      sx={{
                        fontSize: 52,
                        color: "#FFF",
                      }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Información */}
              <div className="flex-1">
                <motion.h1
                  layout
                  className="text-4xl font-bold tracking-tight"
                >
                  {company.company}
                </motion.h1>

                <motion.h2
                  layout
                  className="mt-2 text-2xl font-medium text-gray-700"
                >
                  {company.role}
                </motion.h2>

                <motion.p
                  layout
                  className="mt-4 text-gray-500"
                >
                  {company.from} — {company.to}
                </motion.p>

                {company.website && (
                  <motion.a
                    whileHover={{
                      scale: 1.05,
                    }}
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-sm font-medium"
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
              <div className="hidden lg:flex">
                <div
                  className="w-2 rounded-full"
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
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}