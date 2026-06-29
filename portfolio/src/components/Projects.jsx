import React from "react";

function Projects({ projects }) {
  return (
    <section className="section" id="projects">
      <p className="eyebrow">Minor projects</p>
      <h2 className="project">Live and GitHub links.</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="glass-panel project-card" key={project.title}>
            <span>{project.stack}</span>
            <h3 className="title">{project.title}</h3>
            <p>{project.description}</p>
            <div>
              <a href={project.github} target="_blank" rel="noreferrer" className="project-btn-git">
                GitHub
              </a>
              <a href={project.live} target="_blank" rel="noreferrer" className="project-btn-live">
                Live
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
