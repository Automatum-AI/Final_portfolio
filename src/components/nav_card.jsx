import React, { useState, memo } from 'react';
// ...styles are in App.css...

const NavCard = ({ options = [], images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = options.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="nav-card-container">
      <div className="nav-buttons">
        <button className="circle-button" onClick={handlePrev}>&lt;</button>
        <span className="nav-indicator">{currentIndex + 1} / {total}</span>
        <button className="circle-button" onClick={handleNext}>&gt;</button>
      </div>

      <div className="option-list">
        <div className="option-item active">
          {(() => {
            const opt = options[currentIndex];
            if (!opt) return null;

            if (typeof opt === 'string' || typeof opt === 'number') {
              return opt;
            }

            // Experience card: show role, company, duration if present
            if (opt.role && opt.company && opt.duration) {
              return (
                <>
                  <div className="option-label">{opt.role}</div>
                  <div className="option-description" style={{fontSize: '0.98em', opacity: 0.88, margin: '0.2em 0 0.2em 0'}}>{opt.company}</div>
                  <div className="option-description" style={{fontSize: '0.92em', opacity: 0.7, marginBottom: '0.5em'}}>{opt.duration}</div>
                  {Array.isArray(opt.details) && (
                    <ul className="option-list-items" style={{padding: 0, margin: 0, listStyle: 'none'}}>
                      {opt.details.map((d, i) => (
                        <li key={i} style={{marginBottom: '0.2em'}}>{d}</li>) )}
                    </ul>
                  )}
                </>
              );
            }
            // Project card: show title, description, details
            const label = opt.label || opt.name || opt.title || opt.type;
            const description = opt.description;
            const list = Array.isArray(opt.list) ? opt.list.join(', ') : '';
            return (
              <>
                <div className="option-label">{label}</div>
                {description && <div className="option-description" style={{fontSize: '0.95em', opacity: 0.85, margin: '0.3em 0 0.5em 0'}}>{description}</div>}
                <div className="option-list-items">{list}</div>
              </>
            );
          })()}
        </div>
      </div>

      <div className="image-card">
        <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
      </div>
    </div>
  );
};

export default memo(NavCard);