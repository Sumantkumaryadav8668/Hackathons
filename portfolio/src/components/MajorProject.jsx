import React from "react";

function MajorProject({ project }) {
  return (
    <section className="section major-section">
      <p className="eyebrow">Major project</p>
      <div className="major-card glass-panel">
        <div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <div className="tech-list">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <ul className="feature-list">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="screenshot-grid">
          {project.screenshots.map((shot) => (
            <img src={shot} alt={`${project.title} screenshot`} key={shot} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MajorProject;
