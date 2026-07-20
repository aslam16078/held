// Loader logic
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    // Simulate initialization time for futuristic effect
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            // Trigger initial scroll animations in viewport after load
            document.querySelectorAll('.hidden-on-scroll').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('show');
                }
            });
        }, 800);
    }, 1500);
});

// Scroll Animations using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            // Remove the class when out of view to re-animate on scroll
            entry.target.classList.remove('show');
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden-on-scroll');
hiddenElements.forEach(el => observer.observe(el));

// Background Canvas Animation (Stars, Nebula, Particles, Shooting Stars)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let stars = [];
let shootingStars = [];

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    initCanvas();
    createElements();
});

class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = Math.random() * 0.15 + 0.05;
        this.opacity = Math.random();
        this.opacitySpeed = (Math.random() * 0.02) + 0.005;
        this.dir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.x += this.speedX;
        this.y -= this.speedY; // Stars move upwards slowly

        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;

        // Twinkle effect
        this.opacity += this.opacitySpeed * this.dir;
        if (this.opacity > 1) {
            this.opacity = 1;
            this.dir = -1;
        } else if (this.opacity < 0.1) {
            this.opacity = 0.1;
            this.dir = 1;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.5 ? '#0066ff' : '#00f0ff';
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }
}

class ShootingStar {
    constructor() {
        this.reset();
        this.active = false;
        setTimeout(() => { this.active = true; }, Math.random() * 5000);
    }

    reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.length = Math.random() * 80 + 30;
        this.speed = Math.random() * 10 + 6;
        this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);
        this.opacity = 1;
        this.active = true;
    }

    update() {
        if (!this.active) return;

        this.x -= Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.012;

        if (this.opacity <= 0 || this.x < 0 || this.y > height) {
            this.active = false;
            setTimeout(() => { this.reset(); }, Math.random() * 6000 + 2000);
        }
    }

    draw() {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const gradient = ctx.createLinearGradient(0, 0, -this.length, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.1, 'rgba(0, 240, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.length, 1);
        ctx.lineTo(-this.length, -1);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

function createElements() {
    stars = [];
    particles = [];
    shootingStars = [];

    // Scale amount of particles based on screen size
    const numStars = Math.floor((width * height) / 2500);
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    const numParticles = Math.floor((width * height) / 12000);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    for (let i = 0; i < 4; i++) {
        shootingStars.push(new ShootingStar());
    }
}

// Parallax effect based on mouse movement
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - width / 2) * 0.04;
    mouseY = (e.clientY - height / 2) * 0.04;
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse follow interpolation
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;

    ctx.save();
    ctx.translate(targetX, targetY);

    // Draw background nebula/gradient effects
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, 'rgba(0, 102, 255, 0.06)');
    gradient.addColorStop(0.4, 'rgba(0, 240, 255, 0.02)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(-width, -height, width * 3, height * 3);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    ctx.restore();

    // Shooting stars outside parallax to maintain visual integrity
    shootingStars.forEach(shootingStar => {
        shootingStar.update();
        shootingStar.draw();
    });

    requestAnimationFrame(animate);
}

initCanvas();
createElements();
animate();

// Smooth scrolling for internal anchor links (if added)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
