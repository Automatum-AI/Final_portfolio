import React from 'react';
import NavCard from '../components/nav_card';

const ProjectsSection = React.forwardRef(({ section, visible }, ref) => (
  <section id="projects" style={{ minHeight: '100vh', position: 'relative' }} ref={ref}>
    <div className="section-content">
      <h2 className={`section-title ${visible ? 'visible' : ''}`}>{section.title}</h2>
      <p className={`section-description ${visible ? 'visible' : ''}`}>{section.description}</p>
      <div className={`nav-card-container ${visible ? 'visible' : ''}`}>
        <NavCard options={section.options || []} images={[]} />
      </div>
    </div>
  </section>
));

export default ProjectsSection;
