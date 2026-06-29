import React from "react";

function Education({ education }) {
  return (
    <section className="section" id="education">
      <p className="eyebrow">Education</p>
      <h2 className="Academic">Academic timeline.</h2>
      <div className="timeline">
        {education.map((item) => (
          <article className="timeline-item glass-panel" key={`${item.degree}-${item.year}`}>
            <span>{item.year}</span>
            <h3 className="college">{item.college}</h3>
            <strong>{item.degree}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Education;
