import SectionHeader from './SectionHeader';

export default function ContactSection() {
  return (
    <section id="contact">
      <SectionHeader index="04" title="Contact" />

      <div className="contact-card">
        <h2>Let's work together</h2>

        <p>
          Open to remote opportunities, consulting, and interesting collaborations.
          <br />
          Don't hesitate to reach out.
        </p>

        <div className="contact-links">
          <a
            href="mailto:marquez.damian@outlook.com"
            className="btn btn-primary"
          >
            ✉ Email Me
          </a>

          <a
            href="https://www.linkedin.com/in/marquez-damian"
            target="_blank"
            className="btn btn-ghost"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}