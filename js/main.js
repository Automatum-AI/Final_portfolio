import { BlackHoleScene } from './BlackHoleScene.js';
import { websiteContent } from './content.js';
import { StarField } from './starfield.js';
import { initSkillSection } from './skills.js';
import { initCoordinates } from './coordinates.js';
import { initDate } from './date.js';

class PortfolioApp {
    #currentSectionId;
    
    constructor() {
        this.#currentSectionId = null;
        this.skillsInitDone = false;
        this.init();
    }

    init = () => {
        const canvas = document.getElementById('cosmicBackground');
        if (!canvas) {
            return;
        }
        
        // Initialize HUD: coordinates and date
        initCoordinates();
        initDate();
        // Initialize starfield with reduced star count for clarity
        try {
            console.log('Initializing starfield with canvas:', canvas);
            this.starfield = new StarField(canvas, { starCount: 300 });
        } catch (error) {
            console.error('Failed to initialize starfield:', error);
        }
        
        // Populate content
        this.populateContent();
        
        // Create floating titles
        this.createFloatingTitles();
        
        // Initialize sections
        this.initSections();
        
        // Initialize typewriter effect
        this.initTypewriter();
    };
    
    createFloatingTitles = () => {
        const container = document.getElementById('floating-titles');
        if (!container) {
            return;
        }
        // Clear any existing floating titles
        container.innerHTML = '';
        
        // Generate titles from content configuration
        const sectionOrder = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
        const titles = sectionOrder.map(id => ({ id, text: websiteContent[id].title }));
        
        titles.forEach((titleInfo) => {
            // Create title container with heading and description
            const title = document.createElement('div');
            title.className = 'floating-title';
            title.dataset.section = titleInfo.id;
            // Heading
            const heading = document.createElement('div');
            heading.className = 'floating-title-text';
            heading.textContent = titleInfo.text;
            // Description
            const desc = document.createElement('div');
            desc.className = 'floating-title-desc';
            desc.textContent = websiteContent[titleInfo.id].description;
            // Append sub-elements
            title.append(heading, desc);
            container.appendChild(title);
        });
    };

    initSections = () => {
        const sections = document.querySelectorAll('.section');
        
        const observerOptions = {
            root: null,
            threshold: [0.5],
            rootMargin: '-10% 0px'
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const floatingTitle = document.querySelector(`.floating-title[data-section="${sectionId}"]`);
                const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    this.#currentSectionId = sectionId;
                    document.querySelectorAll('.floating-title').forEach(title => title.classList.remove('visible'));
                    if (floatingTitle) floatingTitle.classList.add('visible');
                    // update nav link highlight
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                    // reveal section content
                    document.querySelectorAll('.section-content').forEach(c => c.classList.remove('visible'));
                    const contentEl = entry.target.querySelector('.section-content');
                    if (contentEl) contentEl.classList.add('visible');
                    // initialize constellation on skills reveal
                    if (sectionId === 'skills' && !this.skillsInitDone) {
                        const skillsContainer = entry.target.querySelector('.section-content');
                        initSkillSection(skillsContainer);
                        this.skillsInitDone = true;
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => sectionObserver.observe(section));
    };
    
    populateContent = () => {
        try {
            // Update metadata
            document.title = websiteContent.siteMetadata.title;
        } catch (error) {
        }
    };
    
    initTypewriter = () => {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;
        
        const texts = websiteContent.home.roles;
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        const type = () => {
            const currentText = texts[currentTextIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && currentCharIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at the end
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before next word
            }
            
            setTimeout(type, typingSpeed);
        };
        
        type();
    };
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
