import { websiteContent } from './content.js';

// Initializes and renders an interactive skills constellation in the given container
export function initSkillSection(container) {
  const skills = websiteContent.skills.options;
  container.style.position = 'relative';
  // Solar system wrapper
  const system = document.createElement('div');
  system.className = 'skill-solar-system';
  container.appendChild(system);
  // Central sun
  const sun = document.createElement('div');
  sun.className = 'solar-sun';
  system.appendChild(sun);
  
  // Orbit configuration: fixed spacing to avoid overlaps
  const minRadius = 80;
  const spacing = 80; // px between orbits, ensures no overlap with 50px planets

  // Create planets with orbit rings
  skills.forEach((skill, i) => {
    const r = minRadius + i * spacing;
    // Orbit ring
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.width = `${r * 2}px`;
    ring.style.height = `${r * 2}px`;
    ring.style.margin = `-${r}px`;
    system.appendChild(ring);

    const planet = document.createElement('div');
    planet.className = 'solar-planet';
    planet.textContent = skill;
    // orbit radius
    planet.style.setProperty('--r', `${r}px`);
    // orbit speed in seconds
    const speed = 10 + i * 2;
    planet.style.setProperty('--speed', `${speed}s`);
    // random start angle
    const startAngle = Math.random() * 360;
    planet.style.setProperty('--start', `${startAngle}deg`);
    planet.style.zIndex = '3';
    system.appendChild(planet);
  });
}
