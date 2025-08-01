import React, { useEffect, useState, useRef } from 'react';
import { useGlobalScroll } from '../scrollControl';
import astro from '../assets/astro.webp';


const HomeSection = React.forwardRef(({ section, visible, scrollProgress }, ref) => {


  const [textIn, setTextIn] = useState(false);
  const [astroIn, setAstroIn] = useState(false);
  const [slideDir, setSlideDir] = useState('in'); // 'in', 'out'

  // Slide in when section is visible (snapped), slide out when not
  // Prevent slide out on first mount
  useEffect(() => {
    if (visible) {
      setSlideDir('in');
      setTextIn(true);
      setTimeout(() => setAstroIn(true), 400);
    } else {
      setSlideDir('out');
      setAstroIn(false);
      setTextIn(false); // Immediately hide text when scrolling out
    }
  }, [visible]);

  let textTransform = 'translateX(-60vw)';
  if (textIn && slideDir === 'in') textTransform = 'translateX(0)';
  if (slideDir === 'out') textTransform = 'translateX(60vw)';

  return (
    <section id="home" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="section-content" style={{
        transform: textTransform,
        opacity: textIn ? 1 : 0,
        transition: 'transform 0.8s cubic-bezier(.77,0,.18,1), opacity 0.7s', // 0.8s matches scroll snap
      }}>
        <h2 className={`section-title ${visible ? 'visible' : ''}`}>{section.title}</h2>
        <p className={`section-description ${visible ? 'visible' : ''}`}>{section.description}</p>
      </div>
      <img
        src={astro}
        alt="Astro"
        className="astro-img"
        style={{
          position: 'absolute',
          top: astroIn ? '55%' : '-300px',
          left: '60%',
          transition: 'top 1.1s cubic-bezier(.77,0,.18,1), opacity 0.7s',
          zIndex: 10,
          width: '340px',
          opacity: astroIn ? 1 : 0,
          transform: 'translate(-50%, -50%) scaleX(-1)',
          animation: astroIn ? 'floatY 2.5s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }}
      />
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '3vh',
        textAlign: 'center',
        width: '100%',
        fontSize: '1.25rem',
        color: '#fff',
        opacity: 0.85,
        letterSpacing: '2px',
        fontWeight: 500,
        textShadow: '0 0 8px #000, 0 0 16px #000',
        zIndex: 10
      }}>
        Website under Developement
      </div>
    </section>
  );
});

export default HomeSection;
