export default function Navbar() {
    return (
      <nav>
        <a href="#hero" className="nav-logo">
          DM<span>.</span>
        </a>
  
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </nav>
    );
  }