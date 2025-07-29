

import React from 'react';
import "../App.css";


const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const NavBar = ({ currentSection }) => {
  return (
    <nav className="main-navbar">
      <ul className="navbar-list">
        {NAV_ITEMS.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={currentSection === item.id ? 'active' : ''}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;