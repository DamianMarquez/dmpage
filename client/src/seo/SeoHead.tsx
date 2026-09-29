import { useEffect } from "react";
import { siteUrl, seoPages, socialImage, type SeoPageKey } from "./seoConfig";

interface Props {
  page: SeoPageKey;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    "link[rel=canonical]"
  );

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

export default function SeoHead({ page: pageKey }: Props) {
  const page = seoPages[pageKey];

  useEffect(() => {
    const canonicalUrl = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
    const personId = `${siteUrl}/#person`;
    const structuredData: Record<string, unknown>[] = [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": personId,
        name: "Damian Marquez",
        jobTitle: "Senior Full Stack Developer and Technical Mentor",
        description: seoPages.home.description,
        url: siteUrl,
        image: socialImage,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Buenos Aires",
          addressCountry: "AR",
        },
        knowsAbout: [
          "Go",
          "Java",
          "React",
          "TypeScript",
          "Distributed systems",
          "Software architecture",
          "AI automation",
          "Technical mentoring",
        ],
        sameAs: ["https://www.linkedin.com/in/marquez-damian"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        inLanguage: "es-AR",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": personId },
      },
    ];

    if (pageKey === "home") {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Damian Marquez",
        description: seoPages.home.description,
        inLanguage: "es-AR",
        publisher: { "@id": personId },
      });
    } else {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.breadcrumb,
            item: canonicalUrl,
          },
        ],
      });
    }

    if (page.profilePage) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#profile`,
        url: canonicalUrl,
        name: page.title,
        inLanguage: "es-AR",
        mainEntity: { "@id": personId },
      });
    }

    document.documentElement.lang = "es";
    document.title = page.title;
    setCanonical(canonicalUrl);
    setMeta("name", "description", page.description);
    setMeta("name", "author", "Damian Marquez");
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", socialImage);
    setMeta("property", "og:locale", "es_AR");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    setMeta("name", "twitter:image", socialImage);

    let jsonLd = document.head.querySelector<HTMLScriptElement>(
      "script#seo-jsonld"
    );
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "seo-jsonld";
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);
  }, [page, pageKey]);

  return null;
}
