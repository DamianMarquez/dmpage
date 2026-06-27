import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./FloatingBackButton.css";

interface FloatingBackButtonProps {
  to: string;
  label?: string;
  showAfter?: number;
}

export default function FloatingBackButton({
  to,
  label = "← Back",
  showAfter = 150,
}: FloatingBackButtonProps) {
  const [visible, setVisible] = useState(false);

  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      // Arriba del todo no se muestra
      if (current < showAfter) {
        setVisible(false);
      } else if (current < lastScroll.current) {
        // Scroll hacia arriba
        setVisible(true);
      } else {
        // Scroll hacia abajo
        setVisible(false);
      }

      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  return (
    <div
      className={`floating-back-top-wrap ${
        visible ? "show" : "hide"
      }`}
    >
      <Link to={to} className="floating-back-button">
        {label}
      </Link>
    </div>
  );
}