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

    /* 3. Mouse Glow Spotlight & Ultra-Subtle 3D Micro-Tilt Effect on Interactive Cards */
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mx', `${x}px`);
            card.style.setProperty('--my', `${y}px`);

            // Ultra-subtle 3D micro-tilt calculation (max 1.8deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -1.8;
            const rotateY = ((x - centerX) / centerX) * 1.8;

            card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
            card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', `0deg`);
            card.style.setProperty('--ry', `0deg`);
        });
    });

    /* 3b. Hero Photo Proximity Hover */
    const heroSection = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroSection && heroVisual) {
        heroSection.addEventListener('mousemove', e => {
            const heroRect = heroSection.getBoundingClientRect();
            const mouseXPercent = (e.clientX - heroRect.left) / heroRect.width;
            // Trigger when cursor is in the right ~55% of the hero
            if (mouseXPercent > 0.45) {
                heroVisual.classList.add('photo-active');
            } else {
                heroVisual.classList.remove('photo-active');
            }
        });
        heroSection.addEventListener('mouseleave', () => {
            heroVisual.classList.remove('photo-active');
        });
    }

    /* 4. Preloader Loading Screen & Silky Smooth Reveal Sequence */
    const preloader = document.getElementById('preloader');
    const preloaderPercent = document.getElementById('preloader-percent');
    const preloaderProgress = document.getElementById('preloader-progress');

    function animateHeroEntrance() {
        const heroTl = gsap.timeline();
        
        // Make text elements visible for fade-in (photo GPU layer is already active & opacity: 0)
        gsap.set('.fade-in-up', { visibility: 'visible' });
        
        heroTl.fromTo('.fade-in-up', 
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.09, ease: 'power3.out' }
        );

        heroTl.fromTo('.hero-visual',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.25, ease: 'power3.out' },
            '-=0.9'
        );
    }

    if (preloader && preloaderPercent && preloaderProgress) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 9) + 4;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setTimeout(() => {
                    const tl = gsap.timeline();
                    tl.to('.preloader-content', {
                        opacity: 0,
                        y: -15,
                        duration: 0.3,
                        ease: 'power2.in'
                    })
                    .to(preloader, {
                        yPercent: -100,
                        duration: 0.85,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                        }
                    })
                    .add(() => {
                        animateHeroEntrance();
                    }, '-=0.55'); // Trigger hero reveal DURING curtain slide up
                }, 100);
            }

            preloaderPercent.textContent = progress < 10 ? `0${progress}` : `${progress}`;
            preloaderProgress.style.width = `${progress}%`;
        }, 30);
    } else {
        animateHeroEntrance();
    }

    // Fade-in elements on scroll
    gsap.utils.toArray('.fade-in').forEach(elem => {
        gsap.set(elem, { autoAlpha: 1 });
        gsap.fromTo(elem,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'expo.out',
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
        let mouse = { x: null, y: null, radius: 150 };
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
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
                // Connect to mouse
                if (mouse.x != null && mouse.y != null) {
                    let dxMouse = particles[i].x - mouse.x;
                    let dyMouse = particles[i].y - mouse.y;
                    let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                    
                    if (distMouse < mouse.radius) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(94, 234, 212, ${0.4 * (1 - distMouse/mouse.radius)})`; // Accent color connection
                        ctx.stroke();
                        
                        // Subtle repel effect
                        particles[i].x += dxMouse * 0.02;
                        particles[i].y += dyMouse * 0.02;
                    }
                }

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

    /* 8. Active Navigation Link on Scroll & Progress Bar */
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-active-indicator');
    const progressBar = document.querySelector('.nav-progress-bar');

    // Update Progress Bar with requestAnimationFrame for smoothness
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                if (progressBar) {
                    progressBar.style.width = scrolled + "%";
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                let hasActive = false;
                
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                        hasActive = true;
                        
                        // Move Indicator
                        if (navIndicator) {
                            const linkRect = link.getBoundingClientRect();
                            const containerRect = link.closest('.nav-links').getBoundingClientRect();
                            navIndicator.style.width = `${linkRect.width}px`;
                            navIndicator.style.left = `${linkRect.left - containerRect.left}px`;
                            navIndicator.style.opacity = '1';
                        }
                    }
                });
                
                if (!hasActive && navIndicator) {
                    navIndicator.style.opacity = '0';
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
