document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* 1. Dynamic Custom Orange Cursor */
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.25;
            cursorY += (mouseY - cursorY) * 0.25;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Add hover effect for interactive elements
        const interactiveSelectors = 'a, button, .bento-card, .tool-badge, .priyansh-project-card, .black-action-pill, .cyan-retro-badge';
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    /* 2. Real-time Clock */
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        function updateClock() {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    /* 3. Terminal Typewriter Effect */
    const cyclingEl = document.getElementById('cycling-text');
    if (cyclingEl) {
        const words = ['DATA ANALYST', 'KPI DASHBOARDS', 'DAX MODELING', 'ROI ANALYTICS', 'AUTOMATED WORKFLOWS'];
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

            let typeSpeed = 60;
            if (isDeleting) { typeSpeed = 35; }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2200; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Pause before typing next
            }

            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1500);
    }

    /* 4. Hero Photo Proximity Hover Effect (Ahmed's V1 Photo Blend) */
    const heroSection = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroSection && heroVisual) {
        heroSection.addEventListener('mousemove', e => {
            const heroRect = heroSection.getBoundingClientRect();
            const mouseXPercent = (e.clientX - heroRect.left) / heroRect.width;
            if (mouseXPercent > 0.40) {
                heroVisual.classList.add('photo-active');
            } else {
                heroVisual.classList.remove('photo-active');
            }
        });
        heroSection.addEventListener('mouseleave', () => {
            heroVisual.classList.remove('photo-active');
        });
    }

    /* 5. Preloader Curtain Reveal & Hero Entrance Sequence */
    const preloader = document.getElementById('preloader');
    const preloaderFill = document.getElementById('preloader-fill');

    function animateHeroEntrance() {
        const heroTl = gsap.timeline();
        
        gsap.set('.hero-visual', { visibility: 'visible' });
        
        heroTl.fromTo('.hero-avatar-badge',
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
        )
        .fromTo('.hero-title', 
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
            '-=0.7'
        )
        .fromTo(['.hero-typewriter', '.hero-desc', '.hero-slash-links', '.hero-starburst-wrapper'],
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
            '-=0.8'
        )
        .fromTo('.hero-visual',
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 1.25, ease: 'power3.out' },
            '-=1.0'
        );
    }

    if (preloader && preloaderFill) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 12) + 6;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setTimeout(() => {
                    gsap.to(preloader, {
                        yPercent: -100,
                        duration: 0.85,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            animateHeroEntrance();
                        }
                    });
                }, 120);
            }
            preloaderFill.style.width = `${progress}%`;
        }, 30);
    } else {
        animateHeroEntrance();
    }

    /* 6. Image 1 Pixel Mosaic Dissolve Canvas Transition */
    const pixelCanvas = document.getElementById('pixel-canvas');
    if (pixelCanvas) {
        const ctx = pixelCanvas.getContext('2d');
        const colors = ['#ffffff', '#000000', '#e85d2a', '#00d4ff', '#ffcc00', '#ff4d4d', '#4dff88'];
        const pixelSize = 14;
        let pixels = [];

        function resizeCanvas() {
            pixelCanvas.width = pixelCanvas.parentElement.clientWidth;
            pixelCanvas.height = pixelCanvas.parentElement.clientHeight;
            initPixels();
        }

        function initPixels() {
            pixels = [];
            const cols = Math.ceil(pixelCanvas.width / pixelSize);
            const rows = Math.ceil(pixelCanvas.height / pixelSize);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // Density increases towards top
                    const densityChance = 0.35 + ((rows - r) / rows) * 0.55;
                    if (Math.random() < densityChance) {
                        pixels.push({
                            x: c * pixelSize,
                            y: r * pixelSize,
                            color: colors[Math.floor(Math.random() * colors.length)],
                            size: pixelSize - 2
                        });
                    }
                }
            }
        }

        function drawPixels() {
            if (!ctx) return;
            ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
            pixels.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawPixels();
    }

    /* 7. GSAP ScrollTrigger Reveal Animations */
    
    // Light Theme Section Slide Up Reveal
    gsap.fromTo('.light-section-card',
        { y: 60, opacity: 0.8 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.light-section-wrapper',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Generic Fade-in elements on scroll
    gsap.utils.toArray('.fade-in').forEach(elem => {
        gsap.fromTo(elem,
            { y: 35, opacity: 0 },
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

    /* 8. Priyansh Signature Bottom Dock Active Section Highlighting */
    const dockTabs = document.querySelectorAll('.dock-tab');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveDock() {
        let currentSection = 'top';
        const scrollPosition = window.scrollY + (window.innerHeight * 0.35);

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        dockTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-section') === currentSection) {
                tab.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveDock);
    updateActiveDock();
});
