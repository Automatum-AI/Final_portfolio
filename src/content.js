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
        duration: "May 2022 - Present"
      },
      {
        role: "Senior Graphic Designer",
        company: "Creative Head",
        duration: "Dec 2020 - Jan 2022"
      },
      {
        role: "Graphic Designer",
        company: "KreditBee",
        duration: "Sept 2019 - Nov 2020"
      },
      {
        role: "Graphic Designer",
        company: "Trescon Global Business Solution Pvt Ltd",
        duration: "Sept 2018 - April 2019"
      }, 
      {
        role: "Graphic Designer",
        company: "Cactus Menswear Pvt Ltd",
        duration: "Dec 2017 - June 2018"
      },
      {
        role: "Graphic Designer",
        company: "PepperAgro",
        duration: "May 2015 - Dec 2017"
      }                  
    ]
  },
  skills: {
    title: "SKILLS",
    description: "",
    options: ["Prompt Engineering", "Generative AI", "Photoshop", "Illustrator", "After Effects", "Figma", "Blender", "Web Design", "Brand Strategy"]
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