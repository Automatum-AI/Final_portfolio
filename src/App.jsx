import './App.css'
import SpiralGalaxy from './components/SpiralGalaxy'
import StarField from './components/StarField'
import content from './content'
import { useEffect, useState, useRef, useMemo } from 'react'
import NavCard from './components/nav_card';
import { useScrollAnimation } from './scrollControl';
import NavBar from './components/navBar';


function getRandomCoord() {
  // Generate a random 8-digit number as a string
  return (Math.floor(Math.random() * 90000000) + 10000000).toString();
}


function getStarDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  return `Star Date: ${dd}.${mm}.${yy}`;
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hh = String(hours).padStart(2, '0');
  return `${hh}.${min}.${ss} ${ampm}`;
}


function App() {
  if (!content || typeof content !== 'object') {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading content...</div>;
  }
  const [scrollProgress, setScrollProgress] = useState(0);
  const [coords, setCoords] = useState({ x: getRandomCoord(), y: getRandomCoord(), z: getRandomCoord() });

  // Star Date and Time states
  const [fullStarDate, setFullStarDate] = useState(getStarDate());
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update coordinates more frequently (every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({ x: getRandomCoord(), y: getRandomCoord(), z: getRandomCoord() });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Update Star Date and Time every second
  useEffect(() => {
    console.log('Updating star date and time');
    const interval = setInterval(() => {
      setFullStarDate(getStarDate());
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? scrollTop / docHeight : 0;
          const clamped = Math.min(Math.max(progress, 0), 1);
          console.log('Scroll:', { scrollTop, docHeight, progress, clamped });
          setScrollProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Star Date display (no rolling animation, update directly)
  const [starDateDisplay, setStarDateDisplay] = useState(fullStarDate);
  useEffect(() => {
    setStarDateDisplay(fullStarDate);
  }, [fullStarDate]);

  const homeRef = useScrollAnimation();
  const aboutRef = useScrollAnimation();
  const skillsRef = useScrollAnimation();
  const projectsRef = useScrollAnimation();
  const experienceRef = useScrollAnimation();
  const contactRef = useScrollAnimation();

  const sectionRefs = {
    home: homeRef,
    about: aboutRef,
    skills: skillsRef,
    projects: projectsRef,
  };

  return (
    <>
      <NavBar />
      {/* Floating star date overlay */}
      <div style={{
        position: 'fixed',
        top: '1.2rem',
        left: '2.2rem',
        zIndex: 9999,
        color: '#fff',
        fontSize: '0.85rem',
        fontFamily: 'monospace',
        letterSpacing: '6.5px',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        minWidth: '0',
        opacity: 0.92,
        whiteSpace: 'pre',
        lineHeight: 1.4,
      }}>
        <div>{starDateDisplay}</div>
        <div>{currentTime}</div>
      </div>
      {/* Floating coordinates overlay */}
      <div style={{
        position: 'fixed',
        top: '1.2rem',
        right: '2.2rem',
        zIndex: 9999,
        color: '#fff',
        fontSize: '0.85rem',
        fontFamily: 'monospace',
        letterSpacing: '6.5px',
        textAlign: 'right',
        background: 'none',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        minWidth: '0',
        opacity: 0.92,
      }}>
        <div style={{marginBottom: 1}}>X: <span style={{fontWeight: 500}}>{coords.x}</span></div>
        <div style={{marginBottom: 1}}>Y: <span style={{fontWeight: 500}}>{coords.y}</span></div>
        <div>Z: <span style={{fontWeight: 500}}>{coords.z}</span></div>
      </div>
      {/* Background visual layers */}
      <StarField />
      {console.log('App: scrollProgress', scrollProgress)}

      {/* Page content */}
      <main className="content">
        {/* Render all sections except experience and contact */}
        {Object.entries(sectionRefs).map(([sectionId, [ref, visible]]) => {
          const section = content[sectionId];
          return (
            <section key={sectionId} id={sectionId} style={{ minHeight: '100vh' }} ref={ref}>
              <div className="section-content">
                <h2 className={`section-title ${visible ? 'visible' : ''}`}>{section.title}</h2>
                <p className={`section-description ${visible ? 'visible' : ''}`}>{section.description}</p>
                {sectionId === 'skills' && (
                  <div className={`nav-card-container ${visible ? 'visible' : ''}`}>
                    <NavCard options={section.options || []} images={section.images || []} />
                  </div>
                )}
                {sectionId === 'projects' && (
                  <div className={`nav-card-container ${visible ? 'visible' : ''}`}>
                    <NavCard options={section.options || []} images={[]} />
                  </div>
                )}
              </div>
            </section>
          );
        })}
        {/* Render experience section after projects */}
        {content.experience && (
          (() => {
            const [ref, visible] = experienceRef;
            return (
              <section key="experience" id="experience" style={{ minHeight: '100vh' }} ref={ref}>
                <div className="section-content">
                  <h2 className={`section-title ${visible ? 'visible' : ''}`}>{content.experience.title}</h2>
                  <p className={`section-description ${visible ? 'visible' : ''}`}>{content.experience.description}</p>
                  <div className={`nav-card-container ${visible ? 'visible' : ''}`}>
                    <NavCard options={content.experience.options || []} images={[]} />
                  </div>
                </div>
              </section>
            );
          })()
        )}
        {/* Render contact section last if it exists */}
        {content.contact && (() => {
          const [ref, visible] = contactRef;
          return (
            <section key="contact" id="contact" style={{ minHeight: '100vh' }} ref={ref}>
              <div className="section-content">
                <h2 className={`section-title ${visible ? 'visible' : ''}`}>{content.contact.title}</h2>
                <p className={`section-description ${visible ? 'visible' : ''}`}>{content.contact.description}</p>
              </div>
            </section>
          );
        })()}
      </main>

      {/* Optional: force scrollable height for testing */}
      <div style={{ height: '100vh' }} />
    </>
  )
}

export default App
