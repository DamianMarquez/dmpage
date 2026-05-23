export default function Hero() {
    return (
      <section id="hero">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
  
        <p className="hero-eyebrow">
          // Senior Full Stack Developer & Tech Mentor
        </p>
  
        <h1>
          Damian
          <br />
          <span className="line2">
            <em>Mar</em>
            <span className="accent-word">quez</span>
          </span>
        </h1>
  
        <p className="hero-sub">
          Started coding at 15. Still at it — now with 18+ years building distributed systems,
          growing engineering teams, and automating everything I can get my hands on.
          Buenos Aires · Open to remote.
        </p>
  
        <div className="hero-ctas">
          <a href="#experience" className="btn btn-primary">
            View Experience
          </a>
  
          <a href="#contact" className="btn btn-ghost">
            Get in Touch
          </a>
        </div>
  
        <div className="hero-stats">
          <div>
            <div className="stat-num">18<span>+</span></div>
            <div className="stat-label">Years of experience</div>
          </div>
  
          <div>
            <div className="stat-num">36<span>+</span></div>
            <div className="stat-label">Devs mentored</div>
          </div>
  
          <div>
            <div className="stat-num">20+</div>
            <div className="stat-label">Production Projects</div>
          </div>
  
        </div>
      </section>
    );
  }