import { useEffect, useState } from "react";
import "./SectionNavigation.css";

export interface NavigationItem {
  id: string;
  label: string;
}

interface Props {
  items: NavigationItem[];
}

export default function SectionNavigation({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible) {
          setActive(visible.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="section-navigation">

      <span className="navigation-title">
        On this page
      </span>

      <nav>

        <ul>

          {items.map((item) => (

            <li
              key={item.id}
              className={active === item.id ? "active" : ""}
            >

              <a href={`#${item.id}`}>
                {item.label}
              </a>

            </li>

          ))}

        </ul>

      </nav>

    </aside>
  );
}