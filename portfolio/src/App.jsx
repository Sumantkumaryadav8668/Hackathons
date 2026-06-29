import React from "react";

import { useEffect, useMemo, useState } from "react";
import {
  contact,
  education,
  // majorProject,
  minorProjects,
  profile,
  skills,
  socialLinks
} from "./data/portfolio.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Contact from "./components/Contact.jsx";
import Socials from "./components/Socials.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Education from "./components/Education.jsx";
import Projects from "./components/Projects.jsx";
// import MajorProject from "./components/MajorProject.jsx";
// import Chatbot from "./components/Chatbot.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import BackToTop from "./components/BackToTop.jsx";
import ParticleBackground from "./components/ParticleBackground.jsx";
import "./styles/app.css";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const navItems = useMemo(
    () => ["home", "about", "skills", "education", "projects", "contact"],
    []
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <ScrollProgress />
      <ParticleBackground />
      <Header
        navItems={navItems}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <main>
        <Hero profile={profile} />
        <Contact contact={contact} />
        <Socials links={socialLinks} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Education education={education} />
        <Projects projects={minorProjects} />
        {/* <MajorProject project={majorProject} /> */}
      </main>
      <BackToTop />
      {/* <Chatbot /> */}
    </div>
  );
}

export default App;
