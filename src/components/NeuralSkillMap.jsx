import React from 'react';

const skills = [
  'Photoshop', 'Illustrator', 'After Effects',
  'Figma', 'Blender', 'Midjourney',
  'Prompt Engineering', 'React', 'Three.js'
];

const radius = 240;

const NeuralSkillMap = ({ visible }) => {
  if (!visible) return null;

  const angleStep = (2 * Math.PI) / skills.length;

  return (
    <div className="neural-map-wrapper">
      <svg width="800" height="800" viewBox="0 0 800 800" className="map-svg" preserveAspectRatio="xMidYMid meet">
        {/* Central Node */}
        <circle cx="400" cy="400" r="80" className="core-node" />
        <text x="400" y="400" textAnchor="middle" className="core-label"></text>

        {skills.map((skill, i) => {
          const angle = i * angleStep;
          const x = 400 + radius * Math.cos(angle);
          const y = 400 + radius * Math.sin(angle);
          return (
            <g key={i} className="bobbing-skill" style={{ animationDelay: `${i * 0.2}s` }}>
              <line x1="400" y1="400" x2={x} y2={y} className="line" />
              <circle cx={x} cy={y} r="12" className="skill-node" />
              <text x={x} y={y - 20} textAnchor="middle" className="skill-label">{skill}</text>
            </g>
          );
        })}
      </svg>

      <style>{`
        .neural-map-wrapper {
          width: 100%;
          height: 100vh;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }

        .map-svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .core-node {
          fill: #f0be67cc;
          stroke: #ffa200ff;
          stroke-width: 2;
          animation: pulse 2s infinite;
        }

        .core-label {
          fill: #fff;
          font-size: 0.8rem;
          font-family: 'Orbitron', monospace;
        }

        .line {
          stroke: #40a7a9ff;
          stroke-width: 1;
        }

        .skill-node {
          fill: #00ffff88;
          stroke: #fff;
          stroke-width: 1;
          transition: transform 0.3s;
        }

        .skill-label {
          fill: #16c9ffaa;
          font-size: 0.7rem;
          font-family: 'Orbitron', monospace;
          pointer-events: none;
        }

        .bobbing-skill {
          animation: bob 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { r: 20; opacity: 1; }
          50% { r: 23; opacity: 0.6; }
          100% { r: 20; opacity: 1; }
        }

        @keyframes bob {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default NeuralSkillMap;