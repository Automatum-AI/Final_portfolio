export class CosmicBackground {
    constructor() {
        this.canvas = document.getElementById('cosmicBackground');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
        this.mouse = { x: 0, y: 0 };
        this.isMouseMoving = false;
        this.mouseTimeout = null;
        
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.isMouseMoving = true;
        
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
            this.isMouseMoving = false;
        }, 100);
    }
    
    handleScroll() {
        // Create new particles on scroll
        const scrollSpeed = Math.abs(window.scrollY - (this.lastScrollY || 0));
        this.lastScrollY = window.scrollY;
        
        if (scrollSpeed > 30) {
            this.addScrollParticles(5);
        }
    }
    
    addScrollParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 3,
                speedY: (Math.random() - 0.5) * 3,
                opacity: 1,
                fadeSpeed: 0.02
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Create stars (static background)
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                opacity: Math.random()
            });
        }
        
        // Create particles (moving elements)
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
        
        this.animate();
    }
    
    drawStar(star) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        this.ctx.fill();
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        
        gradient.addColorStop(0, `rgba(123, 157, 255, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(123, 157, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars with subtle twinkling
        this.stars.forEach(star => {
            star.opacity = Math.sin(Date.now() * 0.001 + star.x) * 0.3 + 0.7;
            this.drawStar(star);
        });
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mouse interaction
            if (this.isMouseMoving) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    particle.speedX += Math.cos(angle) * force * 0.2;
                    particle.speedY += Math.sin(angle) * force * 0.2;
                }
            }
            
            // Apply drag
            particle.speedX *= 0.99;
            particle.speedY *= 0.99;
            
            // Handle scroll particles
            if (particle.fadeSpeed) {
                particle.opacity -= particle.fadeSpeed;
                if (particle.opacity <= 0) return false;
            }
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            this.drawParticle(particle);
            return true;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}
