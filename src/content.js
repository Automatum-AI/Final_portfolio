// src/content.js

const content = {
  hero: {
    title: "BEYOND EARTH. BEYOND DESIGN.",
    description: "Senior Graphic Designer & AI Generalist. I create stunning visuals and smart systems using design and AI.",
    options: []
  },
  about: {
    title: "About Me",
    description: `I’m a passionate designer and technologist. I lead creative teams, design brands, and build tools that automate intelligently.`,
    options: []
  },
  experience: {
    title: "Experience",
    description: "",
    options: [
      {
        role: "Senior Graphic Designer",
        company: "KreditBee",
        duration: "May 2022 – Present",
        details: [
          "Led a team of 4 designers",
          "Created marketing campaigns and visuals",
          "Built internal design systems and workflows"
        ]
      }
    ]
  },
  skills: {
    title: "Skills",
    description: "",
    options: [
      { type: "Software", list: ["Photoshop", "Illustrator", "After Effects", "Figma"] },
      { type: "Professional", list: ["Branding", "UI/UX", "Automation", "Team Leadership"] }
    ]
  },
  contact: {
    title: "Contact",
    description: "Let’s create something futuristic together.",
    options: [
      { type: "Email", value: "captain@designs.ai" }
    ]
  }
};

export default content;