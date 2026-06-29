import React from "react";

function ParticleBackground() {
  return (
    <div className="particle-background" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, index) => (
        <span key={index} style={{ "--i": index }} />
      ))}
    </div>
  );
}

export default ParticleBackground;
