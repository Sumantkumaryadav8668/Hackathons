import React from "react";

function Socials({ links }) {
  return (
    <section className="social-section slim-section" aria-label="Social media links">
      {links.map((link) => (
        <a className="social-link" href={link.href} key={link.label} target="_blank" rel="noreferrer">
          <span aria-hidden="true">{link.icon}</span>
          {link.label}
        </a>
      ))}
    </section>
  );
}

export default Socials;
