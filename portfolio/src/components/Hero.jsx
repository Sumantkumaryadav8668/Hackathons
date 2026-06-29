import React from "react";

function Hero({ profile }) {
  
  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        {/* <p className="eyebrow">Placement ready portfolio</p> */}
        <h1 className="profile-name">{profile.name}</h1>
        <div className="typing-line" aria-label={profile.role}>
          <span>Frontend Developer</span>
        </div>
        <p>
          I build responsive, animated, and user-friendly web interfaces with React,
          JavaScript, and modern CSS.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href={profile.resume} download>
            Download Resume
          </a>
          <a className="secondary-button" href="#projects">
            View Projects
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-label="Profile image">
        <img src={profile.image} alt={`${profile.name} profile`} />
      </div>
    </section>
  );
}

export default Hero;
