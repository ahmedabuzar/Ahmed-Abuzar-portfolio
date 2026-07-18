document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* 1. Real-time Clock */
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        setInterval(() => {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }, 1000);
    }

    /* 2. Cycling Text Animation */
    const cyclingEl = document.getElementById('cycling-text');
    if (cyclingEl) {
        const words = ['DATA VISUALIZATION', 'KPI TRACKING', 'MARKETING ROI', 'AUTOMATION', 'DASHBOARDS'];
        let wordIndex = 0;
        let charIndex = words[0].length;
        let isDeleting = true;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            cyclingEl.textContent = currentWord.substring(0, charIndex);

            let typeSpeed = 50;
            if (isDeleting) { typeSpeed = 30; }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 2000); // Start after 2s
    }

    /* 3. Mouse Glow Effect on Interactive Cards */
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mx', `${x}px`);
            card.style.setProperty('--my', `${y}px`);
        });
    });

    /* 4. Advanced GSAP Scroll Animations */
    
    // Hero Section Initial Animation
    const heroTl = gsap.timeline();
    
    heroTl.set('.fade-in-up', { autoAlpha: 1 }); // Make elements visible for GSAP
    heroTl.fromTo('.fade-in-up', 
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );

    // Fade-in elements on scroll
    gsap.utils.toArray('.fade-in').forEach(elem => {
        gsap.set(elem, { autoAlpha: 1 });
        gsap.fromTo(elem,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    /* 5. Timeline Progress Bar via GSAP ScrollTrigger */
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineProgress = document.querySelector('.timeline-line-progress');
    
    if (timelineContainer && timelineProgress) {
        // Line filling up
        gsap.to(timelineProgress, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: timelineContainer,
                start: 'top center',
                end: 'bottom center',
                scrub: true
            }
        });

        // Dots lighting up
        const dots = document.querySelectorAll('.timeline-dot-wrapper');
        dots.forEach((dotWrapper) => {
            const dot = dotWrapper.querySelector('.timeline-dot');
            
            ScrollTrigger.create({
                trigger: dotWrapper,
                start: 'top center',
                onEnter: () => {
                    dot.classList.remove('inactive');
                    dot.classList.add('active');
                    if(!dot.querySelector('.timeline-dot-ping')) {
                        const ping = document.createElement('div');
                        ping.className = 'timeline-dot-ping';
                        dot.appendChild(ping);
                    }
                }
            });
        });
    }

    /* 6. Smooth Scrolling */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* 7. Canvas Particle Background */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.5;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(248, 252, 251, 0.4)'; // text-bone color
                ctx.fill();
            }
        }
        
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = dx * dx + dy * dy;
                    
                    if (dist < 10000) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(248, 252, 251, ${0.1 - dist/100000})`;
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
});
