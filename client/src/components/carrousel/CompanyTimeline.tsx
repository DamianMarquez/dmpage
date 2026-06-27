import { motion } from "framer-motion";
import  type{ Company } from "./types";

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
    <div className="w-full py-6">
      <div className="flex items-center overflow-x-auto scrollbar-hide px-4">
        {companies.map((company, index) => {
          const active = index === currentIndex;
          const visited = index < currentIndex;

          return (
            <div
              key={company.id}
              className="flex items-center flex-shrink-0"
            >
              <button
                onClick={() => onSelect(index)}
                className="group flex flex-col items-center min-w-[140px]"
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
                  className="relative h-12 w-12 rounded-full border-4 bg-white shadow-lg flex items-center justify-center overflow-hidden"
                >
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.company}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <span className="font-bold text-sm">
                      {company.company[0]}
                    </span>
                  )}

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
                  className="mt-3 text-sm text-center"
                >
                  {company.company}
                </motion.span>

                {/* Período */}
                <span className="text-xs text-gray-400 mt-1">
                  {company.from} - {company.to}
                </span>
              </button>

              {/* Línea */}
              {index < companies.length - 1 && (
                <div className="relative w-24 h-1 mx-2 rounded-full bg-gray-200 overflow-hidden">
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
                    className="absolute left-0 top-0 h-full rounded-full"
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