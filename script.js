document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* 1. Dynamic Custom Orange Cursor (desktop only) */
    const cursor = document.getElementById('custom-cursor');
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (cursor && !isTouchDevice) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        const updateMousePos = e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', updateMousePos);
        window.addEventListener('pointermove', updateMousePos);

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.45;
            cursorY += (mouseY - cursorY) * 0.45;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Color map for logos and interactive icons
        const logoColorMap = {
            'excel': '#217346',
            'power bi': '#F2C811',
            'python': '#3776AB',
            'sql': '#E85D2A',
            'postgresql': '#336791',
            'postgres': '#336791',
            'ai': '#00D2FF',
            'antigravity': '#2F8CF0',
            'open to work': '#FF5E1E',
            'bengaluru, india': '#FF5E1E'
        };

        // Add hover effect for interactive elements (shows pointing hand outline & shifts color)
        const interactiveSelectors = 'a, button, .physics-item, .dock-tab, .social-circle, .bento-card, .tool-icon-square, .status-pill-orange, .priyansh-project-card, .black-action-pill, .cyan-retro-badge, .bento-tall-card, .profile-avatar-circle, .explore-work-link';
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursor.classList.add('hand-mode');

                let color = el.getAttribute('data-color') || el.getAttribute('data-hover-color') || null;
                if (!color && el.getAttribute('title')) {
                    color = logoColorMap[el.getAttribute('title').toLowerCase()] || null;
                }
                if (!color && el.textContent) {
                    color = logoColorMap[el.textContent.trim().toLowerCase()] || null;
                }
                if (color) {
                    const arrow = cursor.querySelector('.cursor-arrow');
                    const hand = cursor.querySelector('.cursor-hand');
                    if (arrow) arrow.style.fill = color;
                    if (hand) hand.style.stroke = color;
                    cursor.style.filter = `drop-shadow(0 0 8px ${color})`;
                    cursor.dataset.activeColor = color;
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursor.classList.remove('hand-mode', 'grabbing-mode');

                const arrow = cursor.querySelector('.cursor-arrow');
                const hand = cursor.querySelector('.cursor-hand');
                if (arrow) arrow.style.fill = '#e85d2a';
                if (hand) hand.style.stroke = '#ff2a2a';
                cursor.style.filter = '';
                delete cursor.dataset.activeColor;
            });
        });
    }

    /* 1b. Interactive Hero Dotted Grid (1:1 Priyansh CSS Mask Match) */
    const heroSection = document.querySelector('.hero');
    const dottedGrid = document.getElementById('hero-dotted-grid');
    if (heroSection && dottedGrid) {
        window.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                dottedGrid.style.setProperty('--mouse-x', `${x}px`);
                dottedGrid.style.setProperty('--mouse-y', `${y}px`);
                dottedGrid.style.opacity = '0.95';
            } else {
                dottedGrid.style.setProperty('--mouse-x', `-1000px`);
                dottedGrid.style.setProperty('--mouse-y', `-1000px`);
                dottedGrid.style.opacity = '0';
            }
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
        const words = ['AUTOMATION', 'KPI DASHBOARDS', 'DAX MODELING', 'DATA PIPELINES', 'ROI ANALYTICS'];
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

    /* 4. Hero Avatar Hover Effect */
    const heroAvatarCircle = document.querySelector('.profile-avatar-circle');
    if (heroAvatarCircle) {
        heroAvatarCircle.addEventListener('mouseenter', () => {
            heroAvatarCircle.classList.add('photo-active');
        });
        heroAvatarCircle.addEventListener('mouseleave', () => {
            heroAvatarCircle.classList.remove('photo-active');
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

    /* 6. Animated Pixel Mosaic Dissolve Canvas Transition (Scroll-Triggered) */
    const pixelCanvas = document.getElementById('pixel-canvas');
    if (pixelCanvas) {
        const ctx = pixelCanvas.getContext('2d');
        const colors = [
            '#ffffff', '#ffffff', '#f4f4f7',
            '#000000', '#0a0a0f', '#141418',
            '#e85d2a', '#ff6633',
            '#00d4ff', '#00b8e0',
            '#ffcc00', '#ffd633',
            '#ff4d6a', '#ff3366',
            '#4dff88', '#33cc66'
        ];
        const blockSize = 22;
        let pixels = [];
        let animationProgress = 0; // 0 to 1, controlled by scroll

        function resizeCanvas() {
            pixelCanvas.width = pixelCanvas.parentElement.clientWidth;
            pixelCanvas.height = pixelCanvas.parentElement.clientHeight;
            initPixels();
        }

        function initPixels() {
            pixels = [];
            const cols = Math.ceil(pixelCanvas.width / blockSize);
            const rows = Math.ceil(pixelCanvas.height / blockSize);

            for (let r = 0; r < rows; r++) {
                const rowProgress = r / rows;
                for (let c = 0; c < cols; c++) {
                    const densityChance = 0.85 - (rowProgress * rowProgress) * 0.82;
                    if (Math.random() < densityChance) {
                        let color;
                        const rand = Math.random();
                        if (rowProgress < 0.3) {
                            if (rand < 0.45) color = colors[Math.floor(Math.random() * 3)];
                            else color = colors[3 + Math.floor(Math.random() * (colors.length - 3))];
                        } else if (rowProgress < 0.6) {
                            color = colors[Math.floor(Math.random() * colors.length)];
                        } else {
                            if (rand < 0.5) color = colors[3 + Math.floor(Math.random() * 3)];
                            else color = colors[6 + Math.floor(Math.random() * (colors.length - 6))];
                        }
                        const size = blockSize - Math.floor(Math.random() * 4) - 1;

                        // Each pixel has a stagger threshold: top pixels appear first
                        const staggerThreshold = rowProgress * 0.7 + (Math.random() * 0.3);

                        // Random initial offset for scatter-in effect
                        const offsetX = (Math.random() - 0.5) * 60;
                        const offsetY = (Math.random() - 0.5) * 60;

                        pixels.push({
                            x: c * blockSize + Math.random() * 3 - 1,
                            y: r * blockSize + Math.random() * 3 - 1,
                            color: color,
                            size: size,
                            stagger: staggerThreshold,
                            offsetX: offsetX,
                            offsetY: offsetY
                        });
                    }
                }
            }
        }

        function drawPixels() {
            if (!ctx) return;
            ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
            pixels.forEach(p => {
                // Calculate this pixel's visibility based on scroll progress
                const pixelProgress = Math.max(0, Math.min(1, (animationProgress - p.stagger * 0.5) / 0.5));
                if (pixelProgress <= 0) return;

                const eased = pixelProgress * pixelProgress * (3 - 2 * pixelProgress); // smoothstep
                const alpha = eased;
                const currentOffsetX = p.offsetX * (1 - eased);
                const currentOffsetY = p.offsetY * (1 - eased);
                const currentSize = p.size * (0.3 + eased * 0.7);

                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(
                    p.x + currentOffsetX,
                    p.y + currentOffsetY,
                    currentSize,
                    currentSize
                );
            });
            ctx.globalAlpha = 1;
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            drawPixels();
        });
        resizeCanvas();

        // GSAP ScrollTrigger drives the animation progress
        ScrollTrigger.create({
            trigger: '.pixel-dissolve-container',
            start: 'top 90%',
            end: 'bottom 40%',
            onUpdate: self => {
                animationProgress = self.progress;
                drawPixels();
            }
        });

        // Initial draw
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

    /* 8. Priyansh Signature Bottom Dock Active Section Highlighting & Click Navigation */
    const dockTabs = document.querySelectorAll('.dock-tab');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveDock() {
        let currentSection = 'top';
        const triggerLine = window.innerHeight * 0.45;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= triggerLine) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection === 'contact' || (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50)) {
            currentSection = 'about';
        }

        dockTabs.forEach(tab => {
            if (tab.getAttribute('data-section') === currentSection) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // Attach scroll, resize, and load listeners so the bottom banner changes as you scroll to other sections
    window.addEventListener('scroll', updateActiveDock, { passive: true });
    window.addEventListener('resize', updateActiveDock, { passive: true });
    window.addEventListener('load', () => {
        updateActiveDock();
        if (window.location.hash) {
            const hashId = window.location.hash.substring(1);
            const targetSec = document.getElementById(hashId);
            if (targetSec) {
                setTimeout(() => {
                    const topPos = targetSec.getBoundingClientRect().top + window.scrollY - 30;
                    window.scrollTo({ top: topPos, behavior: 'auto' });
                    updateActiveDock();
                }, 100);
            }
        }
    });
    updateActiveDock();

    // Smooth click navigation for each pill in the dock
    dockTabs.forEach(tab => {
        tab.addEventListener('click', e => {
            e.preventDefault();
            const targetId = tab.getAttribute('data-section');
            const targetSec = document.getElementById(targetId);
            if (targetSec) {
                dockTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const topPos = targetSec.getBoundingClientRect().top + window.scrollY - 30;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    /* 9. Interactive Physics Sandbox (Drag & Throw with Momentum & Bouncing) */
    const sandbox = document.getElementById('physics-sandbox');
    if (sandbox) {
        // Toggle orange hand cursor when entering/leaving the physics sandbox row
        sandbox.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hand-mode');
        });
        sandbox.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hand-mode', 'grabbing-mode');
        });

        const itemsEl = sandbox.querySelectorAll('.physics-item');
        const items = [];

        // Initialize positions distributed nicely inside the sandbox box
        const boxWidth = sandbox.clientWidth || 800;
        const boxHeight = sandbox.clientHeight || 240;
        const count = itemsEl.length;

        itemsEl.forEach((el, index) => {
            const w = el.offsetWidth || 120;
            const h = el.offsetHeight || 50;

            // Line up all icons properly along the bottom floor on refresh (with 45px safety margin so rotated corners never sink in!)
            const startX = Math.max(20, Math.min(boxWidth - w - 20, (boxWidth / (count + 1)) * (index + 1) - (w / 2)));
            const startY = boxHeight - h - 45;
            const startAngle = 0;

            const item = {
                el,
                w,
                h,
                x: startX,
                y: startY,
                vx: 0,
                vy: 0,
                angle: startAngle,
                va: 0,
                isDragging: false,
                lastMouseX: 0,
                lastMouseY: 0
            };

            el.style.left = '0px';
            el.style.top = '0px';
            el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.angle}deg)`;

            // Mouse & Touch Drag setup
            el.addEventListener('pointerdown', e => {
                e.preventDefault();
                item.isDragging = true;
                item.lastMouseX = e.clientX;
                item.lastMouseY = e.clientY;
                item.vx = 0;
                item.vy = 0;
                item.va = 0;
                el.classList.add('is-dragging');
                if (cursor) {
                    cursor.classList.add('hand-mode');
                    cursor.classList.add('grabbing-mode');
                }
                el.setPointerCapture(e.pointerId);
            });

            el.addEventListener('pointerenter', () => {
                if (cursor) cursor.classList.add('hand-mode');
            });

            el.addEventListener('pointerleave', () => {
                if (cursor && !item.isDragging) {
                    cursor.classList.remove('hand-mode', 'grabbing-mode');
                }
            });

            el.addEventListener('pointermove', e => {
                if (!item.isDragging) return;
                const dx = e.clientX - item.lastMouseX;
                const dy = e.clientY - item.lastMouseY;

                item.vx = dx * 1.35; // Capture linear throwing velocity
                item.vy = dy * 1.35;
                item.va = (dx * 0.45 - dy * 0.3) * 0.55; // Capture rotational throwing spin

                item.x += dx;
                item.y += dy;

                // Keep dragging within reasonable boundaries
                const currentBoxW = sandbox.clientWidth;
                const currentBoxH = sandbox.clientHeight;
                item.x = Math.max(0, Math.min(currentBoxW - item.w, item.x));
                item.y = Math.max(0, Math.min(currentBoxH - item.h, item.y));

                el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.angle}deg)`;

                // Keep custom cursor moving smoothly while dragging an item
                if (cursor) {
                    cursor.style.left = `${e.clientX}px`;
                    cursor.style.top = `${e.clientY}px`;
                }

                item.lastMouseX = e.clientX;
                item.lastMouseY = e.clientY;
            });

            const endDrag = e => {
                if (!item.isDragging) return;
                item.isDragging = false;
                el.classList.remove('is-dragging');
                if (cursor) cursor.classList.remove('grabbing-mode');
                if (e && e.pointerId) {
                    try { el.releasePointerCapture(e.pointerId); } catch (_) { }
                }
            };

            el.addEventListener('pointerup', endDrag);
            el.addEventListener('pointercancel', endDrag);

            items.push(item);
        });

        // 60FPS 2D Rotating Physics Simulation Loop
        function runPhysics() {
            const currentW = sandbox.clientWidth || 800;
            const currentH = sandbox.clientHeight || 270;

            for (let i = 0; i < items.length; i++) {
                const p = items[i];
                if (p.isDragging) continue;

                // Constant downward gravity so icons always fall down and land on the bottom floor
                p.vy += 0.55;

                p.x += p.vx;
                p.y += p.vy;
                p.angle += p.va;

                // Smooth air resistance / friction
                p.vx *= 0.96;
                p.vy *= 0.96;
                p.va *= 0.96;

                // Stop completely when slow so there is zero jitter
                if (Math.abs(p.vx) < 0.04) p.vx = 0;
                if (Math.abs(p.vy) < 0.04) p.vy = 0;
                if (Math.abs(p.va) < 0.04) p.va = 0;

                // Wall & floor bouncing collisions with spin deflection (can land upside down or any how!)
                if (p.x <= 0) {
                    p.x = 0;
                    p.vx = -p.vx * 0.75;
                    p.va += -p.vy * 0.2;
                } else if (p.x >= currentW - p.w) {
                    p.x = currentW - p.w;
                    p.vx = -p.vx * 0.75;
                    p.va += p.vy * 0.2;
                }

                const floorY = currentH - p.h - 45;
                if (p.y <= 0) {
                    p.y = 0;
                    p.vy = -p.vy * 0.75;
                    p.va += p.vx * 0.2;
                } else if (p.y >= floorY) {
                    // Land down on the floor without sinking in!
                    p.y = floorY;
                    p.vy = -p.vy * 0.58;
                    p.vx *= 0.88; // Floor friction slows horizontal sliding
                    p.va *= 0.88; // Floor friction slows rotation
                    if (Math.abs(p.vy) < 0.8) p.vy = 0; // Rest peacefully on the floor in whatever orientation it landed!
                }

                // Simple elastic collision between items with angular spin transfer
                for (let j = i + 1; j < items.length; j++) {
                    const p2 = items[j];
                    if (p2.isDragging) continue;

                    const cx1 = p.x + p.w / 2;
                    const cy1 = p.y + p.h / 2;
                    const cx2 = p2.x + p2.w / 2;
                    const cy2 = p2.y + p2.h / 2;

                    const dx = cx2 - cx1;
                    const dy = cy2 - cy1;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = (Math.min(p.w, p2.w) + Math.min(p.h, p2.h)) * 0.45;

                    if (dist < minDist && dist > 0.001) {
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const overlap = (minDist - dist) * 0.5;

                        p.x -= nx * overlap;
                        p.y -= ny * overlap;
                        p2.x += nx * overlap;
                        p2.y += ny * overlap;

                        const rvx = p2.vx - p.vx;
                        const rvy = p2.vy - p.vy;
                        const normalVel = rvx * nx + rvy * ny;

                        if (normalVel < 0) {
                            const impulse = -normalVel * 0.8;
                            p.vx -= impulse * nx;
                            p.vy -= impulse * ny;
                            p2.vx += impulse * nx;
                            p2.vy += impulse * ny;

                            // Transfer spin on collision
                            p.va += impulse * 1.5;
                            p2.va -= impulse * 1.5;
                        }
                    }
                }

                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.angle}deg)`;
            }

            requestAnimationFrame(runPhysics);
        }

        requestAnimationFrame(runPhysics);
    }

    /* 10. Scroll Character Reveal — Priyansh-style moving color train
     *  As you scroll, a "train" of colors sweeps through the characters.
     *  The train is 9 characters long:
     *  - Front 3 characters: Blue
     *  - Middle 3 characters: Yellow
     *  - Back 3 characters: Red
     *  Ahead of the train, text is faint. Behind the train, text settles to white.
     */
    const scrollColorText = document.getElementById('scroll-color-text');
    if (scrollColorText && typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        const chars = Array.from(scrollColorText.querySelectorAll('.scroll-char'));
        const totalChars = chars.length;

        // Train configuration
        const colorWindowSize = 9;  // 3 blue + 3 yellow + 3 red
        const fadeAheadSize = 8;    // how many chars ahead get partial fade-in

        ScrollTrigger.create({
            trigger: scrollColorText,
            start: 'top 85%',
            end: 'bottom 25%',
            onUpdate: (self) => {
                const progress = self.progress;
                // The front of the color window sweeps from 0 to totalChars + padding
                const frontIndex = progress * (totalChars + colorWindowSize + fadeAheadSize);

                for (let i = 0; i < totalChars; i++) {
                    const char = chars[i];
                    const distBehindFront = frontIndex - i;

                    if (distBehindFront > colorWindowSize) {
                        // Already passed — fully revealed, white
                        char.style.opacity = '1';
                        char.style.color = '#ffffff';
                    } else if (distBehindFront > 0) {
                        // Inside the train — fully visible, color depends on position in train
                        char.style.opacity = '1';

                        // 0-3: Blue (front), 3-6: Yellow (middle), 6-9: Red (back)
                        if (distBehindFront <= 3) {
                            char.style.color = '#2060df'; // Blue
                        } else if (distBehindFront <= 6) {
                            char.style.color = '#FACC15'; // Yellow
                        } else {
                            char.style.color = '#e83600'; // Red
                        }
                    } else if (distBehindFront > -fadeAheadSize) {
                        // Just ahead of train — partial fade-in, white
                        const fadeProgress = 1 - (Math.abs(distBehindFront) / fadeAheadSize);
                        char.style.opacity = String(0.12 + fadeProgress * 0.55);
                        char.style.color = '#ffffff';
                    } else {
                        // Far ahead — faint
                        char.style.opacity = '0.12';
                        char.style.color = '#ffffff';
                    }
                }
            }
        });
    }
});
