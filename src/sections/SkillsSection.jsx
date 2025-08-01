import React from 'react';

const SkillsSection = React.forwardRef(({ section, visible }, ref) => (
  <section id="skills" style={{ minHeight: '100vh', position: 'relative' }} ref={ref}>
    <div className="section-content">
      <h2 className={`section-title ${visible ? 'visible' : ''}`}>{section.title}</h2>
      <p className={`section-description ${visible ? 'visible' : ''}`}>{section.description}</p>
    </div>
  </section>
));

export default SkillsSection;
