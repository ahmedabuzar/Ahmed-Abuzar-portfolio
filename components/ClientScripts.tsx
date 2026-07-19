'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function ClientScripts() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        gsap.registerPlugin(ScrollTrigger);

        /* 1. Real-time Clock */
        const clockEl = document.getElementById('clock');
        let clockInterval: NodeJS.Timeout;
        if (clockEl) {
            clockInterval = setInterval(() => {
                const now = new Date();
                clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
            }, 1000);
        }

        /* 2. Cycling Text Animation */
        const cyclingEl = document.getElementById('cycling-text');
        let typeTimeout: NodeJS.Timeout;
        if (cyclingEl) {
            const words = ['DATA VISUALIZATION', 'KPI TRACKING', 'MARKETING ROI', 'AUTOMATION', 'DASHBOARDS'];
            let wordIndex = 0;
            let charIndex = words[0].length;
            let isDeleting = true;

            function type() {
                if (!cyclingEl) return;
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
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500;
                }

                typeTimeout = setTimeout(type, typeSpeed);
            }
            
            typeTimeout = setTimeout(type, 2000);
        }

        /* Smart Header & Scroll Spy */
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        const onScroll = () => {
            const currentScrollY = window.scrollY;
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (currentScrollY >= (sectionTop - sectionHeight / 3)) {
                    currentSection = section.getAttribute('id') || '';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href')?.substring(1) === currentSection) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', onScroll);

        /* 3. Mouse Glow Effect */
        const interactiveCards = document.querySelectorAll('.interactive-card');
        interactiveCards.forEach(card => {
            const cardEl = card as HTMLElement;
            cardEl.addEventListener('mousemove', e => {
                const rect = cardEl.getBoundingClientRect();
                const x = (e as MouseEvent).clientX - rect.left;
                const y = (e as MouseEvent).clientY - rect.top;
                cardEl.style.setProperty('--mx', `${x}px`);
                cardEl.style.setProperty('--my', `${y}px`);
            });
        });

        /* 4. Preloader & GSAP */
        const preloader = document.getElementById('preloader');
        const counter = document.getElementById('preloader-counter');
        let count = 0;
        
        document.body.style.overflow = 'hidden';

        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 15) + 5;
            if (count >= 100) {
                count = 100;
                clearInterval(interval);
                
                if (counter) counter.textContent = count + '%';
                
                setTimeout(() => {
                    if (preloader) preloader.classList.add('hidden');
                    document.body.style.overflow = '';
                    
                    const heroTl = gsap.timeline();
                    heroTl.set('.fade-in-up', { autoAlpha: 1 });
                    heroTl.fromTo('.fade-in-up', 
                        { y: 30, opacity: 0, filter: 'blur(8px)' },
                        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
                    );
                }, 400);
            } else {
                if (counter) counter.textContent = count + '%';
            }
        }, 60);

        gsap.utils.toArray('.fade-in').forEach(elem => {
            gsap.set(elem as HTMLElement, { autoAlpha: 1 });
            gsap.fromTo(elem as HTMLElement,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem as HTMLElement,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        /* 5. Timeline Progress */
        const timelineContainer = document.querySelector('.timeline-container');
        const timelineProgress = document.querySelector('.timeline-line-progress');
        
        if (timelineContainer && timelineProgress) {
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

            const dots = document.querySelectorAll('.timeline-dot-wrapper');
            dots.forEach((dotWrapper) => {
                const dot = dotWrapper.querySelector('.timeline-dot');
                if (!dot) return;
                
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

        /* 7. Canvas Background */
        const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
        let animationFrameId: number;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                let width: number, height: number;
                const stars: any[] = [];
                const numStars = 1000;
                let mouseX = 0;
                let mouseY = 0;
                let mouseActive = false;
                
                const resize = () => {
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                };
                
                window.addEventListener('resize', resize);
                const onMouseMove = (e: MouseEvent) => {
                    mouseX = (e.clientX - width / 2) * 0.05;
                    mouseY = (e.clientY - height / 2) * 0.05;
                    mouseActive = true;
                };
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseout', () => {
                    mouseActive = false;
                });
                
                resize();
                
                class Star {
                    x: number;
                    y: number;
                    z: number;
                    pz: number;
                    
                    constructor() {
                        this.x = (Math.random() - 0.5) * width * 2;
                        this.y = (Math.random() - 0.5) * height * 2;
                        this.z = Math.random() * width;
                        this.pz = this.z;
                    }
                    
                    update() {
                        this.z = this.z - 2;
                        if (this.z <= 0) {
                            this.z = width;
                            this.x = (Math.random() - 0.5) * width * 2;
                            this.y = (Math.random() - 0.5) * height * 2;
                            this.pz = this.z;
                        }
                    }
                    
                    draw() {
                        if (!ctx) return;
                        let offsetX = mouseActive ? mouseX * (this.z / width) : 0;
                        let offsetY = mouseActive ? mouseY * (this.z / width) : 0;

                        const x = (this.x - offsetX) / this.z * width + width / 2;
                        const y = (this.y - offsetY) / this.z * width + height / 2;
                        const s = (1 - this.z / width) * 2.5;

                        ctx.beginPath();
                        ctx.arc(x, y, s, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(248, 252, 251, ${1 - this.z / width})`;
                        ctx.fill();
                    }
                }
                
                for (let i = 0; i < numStars; i++) {
                    stars.push(new Star());
                }
                
                const animate = () => {
                    ctx.clearRect(0, 0, width, height);
                    
                    ctx.save();
                    ctx.translate(width / 2, height / 2);
                    const time = Date.now() * 0.00005;
                    ctx.rotate(time);
                    ctx.translate(-width / 2, -height / 2);

                    stars.forEach(s => {
                        s.update();
                        s.draw();
                    });
                    
                    ctx.restore();
                    
                    animationFrameId = requestAnimationFrame(animate);
                };
                
                animate();
            }
        }

        return () => {
            clearInterval(clockInterval);
            clearTimeout(typeTimeout);
            clearInterval(interval);
            window.removeEventListener('scroll', onScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return null;
}
