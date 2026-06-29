import React from "react";

function About({ profile }) {
  return (
    <section className="section two-column" id="about">
      <div>
        <p className="eyebrow">About me</p>
        <h2>Clean code, thoughtful interfaces, and steady growth.</h2>
      </div>
      <div className="glass-panel about-card">
        <p>{profile.about}</p>
        <div className="stats-grid">
          <span>
            <strong>10+</strong>
            UI screens
          </span>
          <span>
            <strong>8</strong>
            core skills
          </span>
          <span>
            <strong>100%</strong>
            responsive
          </span>
        </div>
      </div>
    </section>
  );
}

export default About;
