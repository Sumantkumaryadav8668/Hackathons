import React from "react";

function Contact({ contact }) {
  const cards = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replaceAll(" ", "")}` },
    { label: "Location", value: contact.location, href: "#contact" }
  ];

  return (
    <section className="contact-strip section slim-section" id="contact" aria-label="Contact information">
      {cards.map((card) => (
        <a className="glass-panel contact-card" href={card.href} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </a>
      ))}
    </section>
  );
}

export default Contact;
