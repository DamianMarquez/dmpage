import "./AboutPage.css";
import SectionHeader from "../../components/SectionHeader";
import SectionNavigation from "./SectionNavigation";
import FloatingBackButton from "../../components/FloatingBackButton";

export default function AboutPage() {
  const navigationItems = [
    { id: "hero", label: "Hero" },
    { id: "intro", label: "Intro" },
    { id: "my-journey", label: "My Journey" },
    { id: "transition", label: "Transition" },
    { id: "what-drives-me", label: "What Drives Me" },
    { id: "technical-leadership", label: "Leadership" },
    { id: "mentoring", label: "Mentoring" },
    { id: "ai-and-automation", label: "AI & Automation" },
    { id: "philosophy", label: "Philosophy" },
    { id: "engineering-principles", label: "Principles" },
    { id: "technologies", label: "Technologies" },
    { id: "looking-ahead", label: "Looking Ahead" },
    { id: "final-quote", label: "Final Quote" }
  ];

  return (
  <section id="about-page" >

    <FloatingBackButton
      to="/"
      label="Back to Home"
    />

    <SectionHeader
      index="01"
      title="More About Me"
    />

    <div className="about-layout">

      <SectionNavigation items={navigationItems} />

      <main className="about-page">

        {/* ---------------- HERO ---------------- */}

        <header className="about-hero" id="hero">

          <span className="about-eyebrow">
            Software Engineer • Solution Architect • Technical Mentor
          </span>

          <h1>
            Building software,
            <br />
            growing people.
          </h1>

          <p className="hero-description">
            Software engineering has never been just a profession for me.
            It's how I solve problems, simplify complexity, help teams grow,
            and transform ideas into products that continue creating value long
            after they're released.
          </p>

        </header>

        {/* ---------------- INTRO ---------------- */}

        <section className="about-intro" id="intro">

          <p>
            I wrote my first lines of code when I was
            <strong> 15 years old</strong>.
            At that time I wasn't thinking about a career—I was simply fascinated
            by the idea of making computers perform tasks automatically.
            That curiosity eventually became a profession, but more importantly,
            it became a mindset that still drives me today.
          </p>

          <p>
            After more than
            <strong> 18 years of professional experience</strong>,
            I've had the opportunity to work in consulting firms,
            enterprise organizations, mobility platforms, business intelligence,
            and cloud-native environments.
            Every project, every team, and every challenge has reinforced one
            simple idea:
          </p>

          <blockquote className="about-quote">
            Great software isn't built by choosing the newest technology.
            It's built by understanding people, solving the right problem,
            and designing solutions that teams can confidently maintain.
          </blockquote>

        </section>

        {/* ---------------- MY JOURNEY ---------------- */}

        <section className="about-block" id="my-journey">

          <div className="block-title">
            <span>01</span>
            <h2>My Journey</h2>
          </div>

          <div className="block-content">

            <p>
              Throughout my career I've never wanted to become "the Go developer"
              or "the Java developer." Technologies evolve constantly.
              What remains valuable is understanding how software should be
              designed, how teams collaborate, and how technology can support
              business objectives.
            </p>

            <p>
              That perspective has allowed me to comfortably move between
              backend development, frontend applications, distributed systems,
              cloud platforms, automation projects, solution architecture,
              and technical leadership without losing sight of what truly matters:
              delivering value.
            </p>

            <p>
              I've contributed to enterprise platforms serving thousands of users,
              built microservices from scratch, modernized legacy applications,
              designed internal development tools, automated business processes,
              integrated multiple systems, and participated in architectural
              decisions that shaped long-term products.
            </p>

            <p>
              While I genuinely enjoy writing code, I've discovered that some of
              my most rewarding work happens before a single line is written:
              understanding the business, identifying unnecessary complexity,
              challenging assumptions, and helping teams build simpler,
              more sustainable solutions.
            </p>

            <p>
              That's one of the reasons architecture became a natural evolution
              of my career. Good architecture isn't about creating complex
              diagrams or introducing sophisticated patterns.
              It's about making future development easier, reducing uncertainty,
              and allowing teams to evolve software with confidence.
            </p>

          </div>

        </section>

        {/* ---------------- TRANSITION ---------------- */}

        <section className="about-highlight" id="transition">

          <h2>
            The longer I work in software,
            <br />
            the more convinced I become that technology
            is only part of the equation.
          </h2>

          <p>
            Communication, curiosity, mentoring, and continuous learning are
            what truly transform good engineers into great ones.
            Those values have shaped not only the systems I've built,
            but also the teams I've had the privilege to work with.
          </p>

        </section>

                {/* ---------------- WHAT DRIVES ME ---------------- */}

        <section className="about-block" id="what-drives-me">

          <div className="block-title">
            <span>02</span>
            <h2>What Drives Me</h2>
          </div>

          <div className="cards-grid">

            <article className="about-card">

              <div className="card-icon">🏗</div>

              <h3>Architecture</h3>

              <p>
                I enjoy designing systems that remain understandable years after
                they are deployed. Good architecture isn't about adding layers
                or complexity—it's about making software easier to evolve,
                easier to maintain, and easier for new developers to understand.
              </p>

            </article>

            <article className="about-card">

              <div className="card-icon">👥</div>

              <h3>Mentoring</h3>

              <p>
                Watching developers grow has become one of the most rewarding
                parts of my career. Sharing knowledge, reviewing code,
                discussing architecture, and helping others gain confidence is
                something I genuinely enjoy every day.
              </p>

            </article>

            <article className="about-card">

              <div className="card-icon">🤖</div>

              <h3>Automation & AI</h3>

              <p>
                I've always been passionate about eliminating repetitive work.
                Today, AI and automation provide incredible opportunities to
                increase productivity, allowing people to spend less time on
                manual tasks and more time solving meaningful problems.
              </p>

            </article>

            <article className="about-card">

              <div className="card-icon">📚</div>

              <h3>Continuous Learning</h3>

              <p>
                Technology evolves constantly, and curiosity has always been one
                of my greatest strengths. Learning new tools, experimenting with
                different approaches, and continuously improving is simply part
                of how I work.
              </p>

            </article>

          </div>

        </section>

        {/* ---------------- TECHNICAL LEADERSHIP ---------------- */}

        <section className="about-block" id="technical-leadership">

          <div className="block-title">
            <span>03</span>
            <h2>Technical Leadership</h2>
          </div>

          <div className="block-content">

            <p>
              Over the years I naturally transitioned from being focused only on
              implementation to helping teams make better technical decisions.
              Leadership, for me, isn't about having all the answers—it's about
              creating an environment where everyone can contribute their best
              work.
            </p>

            <p>
              I've participated in architectural planning, technical roadmaps,
              code reviews, onboarding processes, engineering standards,
              technical interviews, and cross-team collaboration.
            </p>

            <p>
              One lesson I've learned repeatedly is that many software problems
              aren't actually technical. They're communication problems,
              expectation problems, or process problems disguised as technical
              issues.
            </p>

            <p>
              That's why I value clear communication just as much as clean code.
              The best engineering teams aren't necessarily the ones with the
              smartest developers—they're the ones that communicate effectively,
              collaborate openly, and continuously learn from each other.
            </p>

          </div>

        </section>

        {/* ---------------- MENTORING ---------------- */}

        <section className="about-block" id="mentoring">

          <div className="block-title">
            <span>04</span>
            <h2>Mentoring Developers</h2>
          </div>

          <div className="block-content">

            <p>
              Mentoring has become one of the defining aspects of my career.
              During the last few years I've designed and led multiple training
              programs that helped new developers transition from entry-level
              engineers into confident professionals working on real production
              projects.
            </p>

            <p>
              Across six mentoring waves, I've worked closely with more than
              <strong> 36 developers</strong>, guiding them through software
              architecture, backend development, frontend technologies,
              debugging, clean code practices, code reviews, Git workflows,
              technical communication, and professional growth.
            </p>

            <p>
              My objective has never been simply teaching programming
              languages. I prefer teaching how professional software is actually
              built: understanding requirements, collaborating with teammates,
              making pragmatic decisions, and writing code that someone else
              will be happy to maintain.
            </p>

            <p>
              Nothing is more satisfying than seeing someone who once struggled
              with the basics become the developer others turn to for advice.
              Helping people reach that point is one of the reasons I enjoy this
              profession so much.
            </p>

          </div>

        </section>

        {/* ---------------- AI & AUTOMATION ---------------- */}

        <section className="about-block" id="ai-and-automation">

          <div className="block-title">
            <span>05</span>
            <h2>AI & Automation</h2>
          </div>

          <div className="block-content">

            <p>
              Automation has always been part of the way I think. Long before
              AI became mainstream, I was already looking for ways to eliminate
              repetitive tasks and simplify processes through software.
            </p>

            <p>
              Today, artificial intelligence has accelerated that vision.
              Rather than replacing developers, I believe AI empowers engineers
              to focus on creativity, architecture, and solving complex
              business problems while delegating repetitive work to intelligent
              tools.
            </p>

            <p>
              Through initiatives such as BoostersAI, I've also helped
              professionals outside the software industry discover how AI,
              automation platforms, and low-code solutions can dramatically
              improve their daily work without requiring deep technical
              knowledge.
            </p>

            <p>
              For me, AI isn't the destination. It's another tool that allows
              us to build better products, learn faster, and create more value
              for people.
            </p>

          </div>

        </section>

        {/* ---------------- PHILOSOPHY ---------------- */}

        <section className="about-philosophy" id="philosophy">

          <h2>My Engineering Philosophy</h2>

          <blockquote>

            <p>
              Understand the problem first.
            </p>

            <p>
              Build the simplest solution that solves it.
            </p>

            <p>
              Leave the project better than you found it.
            </p>

          </blockquote>

        </section>

        {/* ---------------- ENGINEERING PRINCIPLES ---------------- */}

        <section className="about-block" id="engineering-principles">

          <div className="block-title">
            <span>06</span>
            <h2>Engineering Principles</h2>
          </div>

          <div className="principles-grid">

            <div className="principle-item">
              <span>✔</span>
              <p>Simplicity always beats unnecessary complexity.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Code is read far more often than it is written.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Architecture exists to help teams move faster—not slower.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Automation is an investment, not a luxury.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Communication solves more problems than frameworks.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Mentoring multiplies the impact of great engineers.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Technology should solve business problems—not create new ones.</p>
            </div>

            <div className="principle-item">
              <span>✔</span>
              <p>Never stop learning. Curiosity is part of the profession.</p>
            </div>

          </div>

        </section>

        {/* ---------------- TECHNOLOGIES ---------------- */}

        <section className="about-block" id="technologies">

          <div className="block-title">
            <span>07</span>
            <h2>Technologies I Enjoy Working With</h2>
          </div>

          <div className="tech-tags">

            {[
              "Go",
              "Java",
              "Spring Boot",
              "Node.js",
              "React",
              "TypeScript",
              "Docker",
              "RabbitMQ",
              "MongoDB",
              "PostgreSQL",
              "MySQL",
              "Redis",
              "REST APIs",
              "Microservices",
              "Hexagonal Architecture",
              "Cloud Native",
              "Git",
              "CI/CD",
              "Power Automate",
              "Copilot Studio",
              "N8N",
              "AI Automation",
              "Solution Architecture",
              "Technical Mentoring"
            ].map((tech) => (

              <span
                key={tech}
                className="tech-chip"
              >
                {tech}
              </span>

            ))}

          </div>

        </section>

        {/* ---------------- LOOKING AHEAD ---------------- */}

        <section className="about-block" id="looking-ahead">

          <div className="block-title">
            <span>08</span>
            <h2>Looking Ahead</h2>
          </div>

          <div className="block-content">

            <p>
              After almost two decades in software engineering,
              what motivates me hasn't really changed.
            </p>

            <p>
              I still enjoy solving difficult problems,
              building reliable software,
              mentoring developers,
              learning new technologies,
              and finding better ways to help teams create products
              that make a real difference.
            </p>

            <p>
              Today I'm particularly interested in solution architecture,
              distributed systems, AI-assisted development,
              developer experience,
              automation,
              and building engineering cultures where people can do
              their best work.
            </p>

            <p>
              I don't believe great software is created by individuals.
              It's created by teams that trust each other,
              communicate openly,
              and continuously improve together.
            </p>

          </div>

        </section>

        {/* ---------------- FINAL QUOTE ---------------- */}

        <section className="about-closing" id="final-quote">

          <blockquote>

            Great software isn't measured by the number of technologies it uses.

            <br />
            <br />

            It's measured by the value it creates,
            the people it empowers,
            and how well it stands the test of time.

          </blockquote>
 </section>

</main>

    </div>

  </section>
  );
}