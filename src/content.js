// src/content.js

const content = {
  home: {
    title: "BEYOND EARTH. BEYOND DESIGN.",
    description: "Senior Graphic Designer & AI Generalist.",
    options: []
  },
  about: {
    title: "CAPTAIN'S LOG",
    description: `I’m a passionate designer and technologist. I lead creative teams, design brands, and build tools that automate intelligently.`,
    options: []
  },
  projects: {
    title: "PROJECTS",
    description: "A selection of my recent and impactful work.",
    options: [
      {
        title: "AI Portfolio Website",
        description: "A personal portfolio built with React, Vite, and custom generative visuals.",
        details: [
          "Interactive spiral galaxy animation",
          "Dynamic overlays and navigation",
          "Minimal, glassmorphic UI"
        ]
      },
      {
        title: "Design Automation Toolkit",
        description: "A Figma plugin and workflow for automating repetitive design tasks.",
        details: [
          "Batch export and resizing",
          "Brand asset generation",
          "AI-powered color suggestions"
        ]
      },
      {
        title: "Marketing Campaigns",
        description: "Led and executed multi-channel campaigns for fintech and tech brands.",
        details: [
          "Concept to delivery for 10+ campaigns",
          "Motion graphics and social media assets",
          "Team leadership and client presentations"
        ]
      }
    ]
  },

  experience: {
    title: "EXPERIENCE",
    description: "10+ years in design and 1+ years in AI.",
    options: [
      {
        role: "Senior Graphic Designer",
        company: "KreditBee",
        duration: "May 2022 – Present"
      },
      {
        role: "Senior Graphic Designer",
        company: "KreditBee",
        duration: "May 2022 – Present"
      }
    ]
  },
  skills: {
    title: "SKILLS",
    description: "",
    options: ["Photoshop", "Illustrator", "After Effects", "Figma"    ]
  },
  contact: {
    title: "CONTACT",
    description: "Let’s create something futuristic together.",
    options: [
      { type: "Email", value: "captain@designs.ai" }
    ]
  }
};

export default content;