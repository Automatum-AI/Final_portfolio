import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';

export class BlackHoleScene {
    constructor(containerId) {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0f);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        // Debug
        console.log('Initializing BlackHoleScene...');
        
        // Get container and setup renderer
        this.container = document.getElementById(containerId);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Animation properties
        this.clock = new THREE.Clock();
        this.starCount = 9000;
        this.trailLength = 30;
        this.starData = this.initStarData();
        
        // Scene elements
        this.group = new THREE.Group();
        this.scene.add(this.group);
        
        // Initialize components
        this.initBlackHole();
        this.initGlow();
        this.initStars();
        this.initLights();
        
        // Camera position
        this.camera.position.z = 150;
        this.camera.position.y = 30;
        this.camera.lookAt(0, 0, 0);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Debug
        console.log('Scene initialized, canvas size:', {
            width: this.renderer.domElement.width,
            height: this.renderer.domElement.height
        });
        
        // Start animation
        this.animate();
    }
    
    initStarData() {
        return Array.from({ length: this.starCount }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: 12 + Math.random() * 8,
            y: (Math.random() - 0.5) * 2,
            speed: 0.3 + Math.random() * 0.3
        }));
    }
    
    initBlackHole() {
        const geometry = new THREE.SphereGeometry(10, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 'black',
            metalness: 0.9,
            roughness: 0.4
        });
        this.core = new THREE.Mesh(geometry, material);
        this.core.position.z = -50;
        this.group.add(this.core);
    }
    
    initGlow() {
        const geometry = new THREE.SphereGeometry(7.5, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color('orange'),
            emissiveIntensity: 5,
            transparent: true,
            opacity: 200,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            roughness: 0.5,
            metalness: 1
        });
        this.glow = new THREE.Mesh(geometry, material);
        this.glow.position.z = -50;
        this.group.add(this.glow);
    }
    
    initStars() {
        this.trailPositions = new Float32Array(this.starCount * this.trailLength * 3);
        this.trailColors = new Float32Array(this.starCount * this.trailLength * 3);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(this.trailColors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            transparent: true,
            vertexColors: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.stars = new THREE.Points(geometry, material);
        this.stars.position.z = -50;
        this.group.add(this.stars);
    }
    
    initLights() {
        const pointLight = new THREE.PointLight(0xffcc88, 100);
        pointLight.position.set(0, 0, -30);
        this.scene.add(pointLight);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.09);
        this.scene.add(ambientLight);
    }
    
    updateStars(time) {
        for (let i = 0; i < this.starCount; i++) {
            const { angle, radius, y, speed } = this.starData[i];
            for (let j = 0; j < this.trailLength; j++) {
                const trailT = time - j * 0.015;
                const a = (angle + trailT * speed) % (Math.PI * 2);
                const r = radius;
                const x = Math.cos(a) * r;
                const z = Math.sin(a) * r;
                const yTrail = y + Math.sin(trailT * 0.5 + i) * 0.5 * (i % 2 === 0 ? 1 : -1);
                
                const idx = (i * this.trailLength + j) * 3;
                this.trailPositions[idx] = x;
                this.trailPositions[idx + 1] = yTrail;
                this.trailPositions[idx + 2] = z;
                
                const fade = (this.trailLength - j) / this.trailLength;
                this.trailColors[idx] = 1.0 * fade;
                this.trailColors[idx + 1] = 0.3 * fade;
                this.trailColors[idx + 2] = 0.0;
            }
        }
        
        this.stars.geometry.attributes.position.needsUpdate = true;
        this.stars.geometry.attributes.color.needsUpdate = true;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    updateScene(scroll = 0) {
        const time = this.clock.getElapsedTime();
        
        // Update core
        this.core.rotation.y = -time * 0.1;
        
        // Update glow
        this.glow.rotation.y = time * 0.2;
        this.glow.rotation.x = time * 0.1;
        
        // Update stars
        this.updateStars(time);
        
        // Update group rotation
        this.group.rotation.y = Math.PI / 10;
        this.group.rotation.x = Math.PI / 12;
        
        // Scroll-based zoom effect
        const initialZ = -100;
        const targetZ = -30;
        const scrollNorm = Math.min(scroll / 5000, 1);
        const newZ = initialZ + (targetZ - initialZ) * scrollNorm;
        const distanceFactor = 1 - (newZ - targetZ) / (initialZ - targetZ);
        const scale = 3.5 + distanceFactor * 7.5;
        
        this.core.position.z = newZ;
        this.glow.position.z = newZ;
        this.stars.position.z = newZ;
        
        this.core.scale.set(scale, scale, scale);
        this.glow.scale.set(scale * 1.4, scale * 1.4, scale * 1.4);
        this.stars.scale.set(scale, scale, scale);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const scroll = window.scrollY;
        this.updateScene(scroll);
        
        this.renderer.render(this.scene, this.camera);
    }
}
