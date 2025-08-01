import React from 'react';

const ContactSection = React.forwardRef(({ section, visible }, ref) => (
  <section id="contact" style={{ minHeight: '100vh' }} ref={ref}>
    <div className="section-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div className="contact-left" style={{ flex: 1 }}>
        <h2 className={`section-title ${visible ? 'visible' : ''}`}>{section.title}</h2>
        <p className={`section-description ${visible ? 'visible' : ''}`}>{section.description}</p>
      </div>
      <div
        className={`contact-right ${visible ? 'visible' : ''}`}
        style={{
          position: 'absolute',
          bottom: '10rem',
          right: '-30rem',
          textAlign: 'right',
          color: '#fff',
          zIndex: 10
        }}
      >
        {section.options?.map((line, index) => (
          <div key={index} style={{ margin: '0.5rem 0' }}>
            <div style={{ fontWeight: 'bold' }}>{line.type}</div>
            {(line.type === 'LinkedIn' || line.type === 'Behance') ? (
              <a
                href={line.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'underline' }}
              >
                {line.value}
              </a>
            ) : (
              <div>{line.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
));

export default ContactSection;
