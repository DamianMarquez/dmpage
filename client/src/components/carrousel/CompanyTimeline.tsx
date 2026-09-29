import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";
import  type{ Company } from "./types";
import LogoImage from "./LogoImage";

interface Props {
  companies: Company[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const CompanyTimeline = forwardRef<HTMLDivElement, Props>(function CompanyTimeline({
  companies,
  currentIndex,
  onSelect,
}, forwardedRef) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setHasOverflow(maxScrollLeft > 1);
    setCanScrollLeft(element.scrollLeft > 1);
    setCanScrollRight(element.scrollLeft < maxScrollLeft - 1);
  }, []);

  const scrollBy = useCallback((amount: number) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);
    element.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    const element = scrollRef.current;
    const active = activeRef.current;
    if (!element || !active) return;

    const elementRect = element.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const targetLeft = element.scrollLeft
      + activeRect.left
      - elementRect.left
      - (element.clientWidth - activeRect.width) / 2;

    element.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [currentIndex]);

  return (
    <div ref={forwardedRef} className="company-timeline">
      <div ref={scrollRef} className="company-timeline-viewport">
        {hasOverflow && (
          <IconButton
            aria-label="Desplazar empresas hacia la izquierda"
            className="company-timeline-arrow company-timeline-arrow-left"
            disabled={!canScrollLeft}
            onClick={() => scrollBy(-240)}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

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
                ref={active ? activeRef : null}
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
                    duration: 0.65,
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
                      duration: 0.7,
                    }}
                    className="company-timeline-connector-progress"
                  />
                </div>
              )}
            </div>
          );
        })}
        </div>

        {hasOverflow && (
          <IconButton
            aria-label="Desplazar empresas hacia la derecha"
            className="company-timeline-arrow company-timeline-arrow-right"
            disabled={!canScrollRight}
            onClick={() => scrollBy(240)}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
});

export default CompanyTimeline;
