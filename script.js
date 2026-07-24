document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* 1. Real-time Clock (Bengaluru Time Format) */
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        function updateClock() {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    /* 2. Preloader Curtain Reveal & Hero Entrance */
    const preloader = document.getElementById('preloader');

    function animateHeroEntrance() {
        const heroTl = gsap.timeline();
        
        heroTl.fromTo('.hero-avatar-wrapper', 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }
        )
        .fromTo('.hero-heading',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            '-=0.8'
        )
        .fromTo(['.hero-tagline', '.hero-intro', '.hero-inline-links', '.hero-action'],
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' },
            '-=0.7'
        );
    }

    if (preloader) {
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
        }, 600);
    } else {
        animateHeroEntrance();
    }

    /* 3. GSAP ScrollTrigger Fade-In for Sections */
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

    /* 4. Active Bottom Dock Navigation Highlighting */
    const dockItems = document.querySelectorAll('.dock-item');
    const sections = document.querySelectorAll('section[id], header[id]');

    function updateActiveDock() {
        let currentSection = 'top';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        dockItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === currentSection) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveDock);
    updateActiveDock();
});
