import React from "react";

function Skills({ skills }) {
  return (
    <section className="section" id="skills">
      <p className="eyebrow">Skills</p>
      <h2 className="skills">Skill Progress Tracker.</h2>
      <div className="skills-grid">
        {skills.map((skill) => (
          <article className="glass-panel skill-card" key={skill.name}>
            <div>
              <strong>{skill.name}</strong>
              <span>{skill.level}%</span>
            </div>
            <div className="progress-track" aria-label={`${skill.name} ${skill.level}%`}>
              <span style={{ "--level": `${skill.level}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Skills;
