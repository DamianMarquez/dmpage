const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

const clientBuildPath = path.join(__dirname, '../client/dist');
const indexTemplatePath = path.join(clientBuildPath, 'index.html');

const siteUrl = 'https://marquezdamian.com.ar';
const socialImage = `${siteUrl}/og-image.svg`;
const pageMetadata = {
    '/': {
        title: 'Damian Marquez | Desarrollador Full Stack Senior',
        description: 'Damian Marquez es desarrollador Full Stack Senior, arquitecto de soluciones y mentor técnico especializado en Go, Java, React, sistemas distribuidos y automatización con AI.'
    },
    '/sections/about': {
        title: 'Sobre Damian Marquez | Arquitectura, liderazgo y mentoring',
        description: 'Conocé la trayectoria de Damian Marquez en ingeniería de software, arquitectura de soluciones, liderazgo técnico, mentoring y automatización.'
    },
    '/sections/experience': {
        title: 'Experiencia profesional | Damian Marquez',
        description: 'Experiencia profesional de Damian Marquez en Go, Java, React, sistemas distribuidos, Business Intelligence, cloud, automatización y liderazgo técnico.'
    },
    '/sections/skills': {
        title: 'Skills y tecnologías | Go, Java, React y AI',
        description: 'Stack técnico de Damian Marquez: Go, Java, Spring Boot, React, TypeScript, Node.js, bases de datos, cloud, mensajería, AI y automatización.'
    },
    '/sections/contact': {
        title: 'Contacto | Damian Marquez',
        description: 'Contactá a Damian Marquez para oportunidades remotas, consultoría, arquitectura de software, mentoring técnico y colaboraciones interesantes.'
    },
    '/games': {
        title: 'Juegos educativos | Damian Marquez',
        description: 'Juegos interactivos para aprender conceptos de arquitectura y desarrollo de software.'
    },
    '/games/hexagonal-defender': {
        title: 'Hexagonal Defender | Juegos educativos',
        description: 'Defendé tu arquitectura. Identificá dónde pertenece cada componente de una Arquitectura Hexagonal.'
    }
};

const fallbackContent = {
    '/': {
        heading: 'Damian Marquez',
        text: 'Desarrollador Full Stack Senior, arquitecto de soluciones y mentor técnico especializado en Go, Java, React, sistemas distribuidos y automatización con AI.'
    },
    '/sections/about': {
        heading: 'Sobre Damian Marquez',
        text: 'Trayectoria en ingeniería de software, arquitectura de soluciones, liderazgo técnico, mentoring y automatización desde Buenos Aires, Argentina.'
    },
    '/sections/experience': {
        heading: 'Experiencia profesional',
        text: 'Experiencia en Go, Java, React, sistemas distribuidos, Business Intelligence, cloud, automatización y liderazgo técnico.'
    },
    '/sections/skills': {
        heading: 'Skills y tecnologías',
        text: 'Go, Java, Spring Boot, React, TypeScript, Node.js, bases de datos, cloud, mensajería, AI, automatización, arquitectura y mentoring.'
    },
    '/sections/contact': {
        heading: 'Contacto',
        text: 'Disponible para oportunidades remotas, consultoría, arquitectura de software, mentoring técnico y colaboraciones interesantes.'
    },
    '/games': {
        heading: 'Juegos educativos',
        text: 'Aprendé conceptos de software jugando. Conocé Hexagonal Defender, un juego para identificar las capas y dependencias de la Arquitectura Hexagonal.'
    },
    '/games/hexagonal-defender': {
        heading: 'Hexagonal Defender',
        text: 'Defendé tu arquitectura. Identificá dónde pertenece cada componente de una Arquitectura Hexagonal.'
    }
};

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function setMeta(html, attribute, key, content) {
    const escapedContent = escapeHtml(content);
    const pattern = new RegExp(
        `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`,
        'i'
    );
    return html.replace(
        pattern,
        `<meta ${attribute}="${key}" content="${escapedContent}" />`
    );
}

function renderIndex(pathname) {
    const metadata = pageMetadata[pathname] || pageMetadata['/'];
    const fallback = fallbackContent[pathname] || fallbackContent['/'];
    const canonical = `${siteUrl}${pathname === '/' ? '/' : pathname}`;
    let html = fs.readFileSync(indexTemplatePath, 'utf8');

    html = html.replace(/<html lang="[^"]*">/i, '<html lang="es">');
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
    html = html.replace(
        /<link rel="canonical" href="[^"]*"\s*\/>/i,
        `<link rel="canonical" href="${canonical}" />`
    );
    html = setMeta(html, 'name', 'description', metadata.description);
    html = setMeta(html, 'property', 'og:title', metadata.title);
    html = setMeta(html, 'property', 'og:description', metadata.description);
    html = setMeta(html, 'property', 'og:url', canonical);
    html = setMeta(html, 'property', 'og:image', socialImage);
    html = setMeta(html, 'name', 'twitter:title', metadata.title);
    html = setMeta(html, 'name', 'twitter:description', metadata.description);
    html = setMeta(html, 'name', 'twitter:image', socialImage);

    const personData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Damian Marquez',
        jobTitle: 'Senior Full Stack Developer and Technical Mentor',
        url: siteUrl,
        image: socialImage,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Buenos Aires',
            addressCountry: 'AR'
        },
        sameAs: ['https://www.linkedin.com/in/marquez-damian']
    };
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: metadata.title,
        description: metadata.description,
        inLanguage: 'es-AR',
        about: { '@id': `${siteUrl}/#person` }
    };
    const structuredDataSet = [personData, structuredData];
    if (pathname === '/') {
        structuredDataSet.push({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            url: siteUrl,
            name: 'Damian Marquez',
            inLanguage: 'es-AR',
            publisher: { '@id': `${siteUrl}/#person` }
        });
    } else {
        structuredDataSet.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: metadata.title, item: canonical }
            ]
        });
    }
    if (pathname === '/sections/about') {
        structuredDataSet.push({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': `${canonical}#profile`,
            url: canonical,
            name: metadata.title,
            inLanguage: 'es-AR',
            mainEntity: { '@id': `${siteUrl}/#person` }
        });
    }

    html = html.replace(
        /<script id="seo-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/i,
        `<script id="seo-jsonld" type="application/ld+json">${JSON.stringify(structuredDataSet)}</script>`
    );
    html = html.replace(
        /<!-- SEO_NOSCRIPT -->/i,
        `<noscript id="seo-noscript"><main><h1>${escapeHtml(fallback.heading)}</h1><p>${escapeHtml(fallback.text)}</p><nav aria-label="Navegación principal"><a href="/">Inicio</a> <a href="/sections/about">Sobre mí</a> <a href="/sections/experience">Experiencia</a> <a href="/sections/skills">Skills</a> <a href="/sections/contact">Contacto</a> <a href="/blog">Blog</a> <a href="/games">Juegos</a></nav></main></noscript>`
    );

    return html;
}

app.use(express.static(clientBuildPath));

app.get('/blog', (_, res) => {
    res.sendFile(path.join(clientBuildPath, 'blog.html'));
});

app.get(Object.keys(pageMetadata), (req, res) => {
    res.send(renderIndex(req.path));
});

app.get('*', (_, res) => {
    res.send(renderIndex('/'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
