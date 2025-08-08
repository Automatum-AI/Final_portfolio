/**
 * 3D Rotating Starfield with Parallax on Scroll
 */
class Star {
  constructor(width, height, depth) {
    this.reset(width, height, depth);
  }
  reset(width, height, depth) {
    // Random position in 3D space
    this.x = (Math.random() * 2 - 1) * width;
    this.y = (Math.random() * 2 - 1) * height;
    this.z = Math.random() * depth;
    this.depth = depth;
    // Star brightness and size based on depth
    this.brightness = 1 - this.z / depth;
    // Reduce star size: lower multiplier and minimum size for smaller stars
    this.size = Math.max(0.3, this.brightness * 1);
  }
  update(speed) {
    // Move camera forward
    this.z -= speed;
    if (this.z <= 0) this.reset(Math.abs(this.x), Math.abs(this.y), this.depth);
  }
  draw(ctx, width, height, scrollY, rotation, depth) {
    // 2D spin around Z-axis (swirl effect)
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    // Rotate x and y around z-axis
    const x3 = this.x * cos - this.y * sin;
    const y3 = this.x * sin + this.y * cos;
    const z3 = this.z;
    // Perspective projection
    const scale = depth / (depth + z3);
    const x2d = x3 * scale + width / 2;
    // Parallax: apply scroll offset scaled by depth for realistic effect
    let y2d = y3 * scale + height / 2 - scrollY * scale;
    // Wrap y to canvas bounds for seamless visibility across sections
    y2d = ((y2d % height) + height) % height;
    const alpha = this.brightness * scale;
    // Draw star
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

export class StarField {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('Canvas element is required');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.depth = options.depth || 1000;
    this.starCount = options.starCount || 700;
    this.speed = options.speed || 2;
    this.scrollY = 0;
    this.parallaxStrength = options.parallaxStrength || 0.5;
    this.rotation = 0;
    this.rotationSpeed = options.rotationSpeed || 0.0001;
    this.stars = [];
    this._bindEvents();
    this._init();
    this._animate();
  }
    _bindEvents() {
      window.addEventListener('resize', () => this._resize());
      // Listen to scroll on main container for parallax
      const main = document.querySelector('main');
      if (main) {
        main.addEventListener('scroll', () => {
          this.scrollY = main.scrollTop;
        });
      }
    }
  _init() {
    this._resize();
    this._createStars();
  }
  _resize() {
    const dpr = window.devicePixelRatio || 1;
    // Ensure canvas always matches viewport size
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    // Explicitly set canvas CSS size
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
  }
  _createStars() {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push(new Star(this.width, this.height, this.depth));
    }
  }
  _animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.rotation = (this.rotation + this.rotationSpeed) % (Math.PI * 2);
    // compute parallax offset based on strength
    const offsetY = this.scrollY * this.parallaxStrength;
    for (let star of this.stars) {
      star.draw(
        this.ctx,
        this.width,
        this.height,
        offsetY,
        this.rotation,
        this.depth
      );
    }
    requestAnimationFrame(() => this._animate());
  }
}
