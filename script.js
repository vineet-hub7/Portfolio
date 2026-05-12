document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       SCROLL REVEAL — Intersection Observer with stagger
       ========================================================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .section-divider').forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       ANIMATED PROGRESS BAR
       ========================================================================== */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 2px; z-index: 1001;
        background: linear-gradient(90deg, var(--accent), var(--accent-warm));
        width: 0%; transition: width 0.1s linear;
        pointer-events: none;
        box-shadow: 0 0 12px var(--accent);
    `;
    document.body.appendChild(progressBar);

    /* ==========================================================================
       SCROLL HANDLER — Progress bar + back-to-top
       ========================================================================== */
    const backToTop = document.getElementById('back-to-top');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
                progressBar.style.width = `${progress}%`;

                if (backToTop) {
                    if (scrolled > 500) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       THEME TOGGLE
       ========================================================================== */
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

    /* ==========================================================================
       RESUME MODAL
       ========================================================================== */
    window.openResume = function() {
        const modal = document.getElementById('resume-modal');
        const loader = document.getElementById('resume-loader');
        const viewer = document.getElementById('resume-viewer');
        const iframe = viewer ? viewer.querySelector('iframe') : null;

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (loader) loader.style.opacity = '1';

            if (iframe) {
                const currentSrc = iframe.getAttribute('data-src') || iframe.src;
                iframe.src = '';
                iframe.src = currentSrc || 'Vineet_Jethani.pdf';
            }
        }
    };

    window.closeResume = function() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeResume();
        }
    });

    const resumeIframe = document.querySelector('#resume-modal iframe');
    if (resumeIframe) {
        resumeIframe.onload = function() {
            const loader = document.getElementById('resume-loader');
            const viewer = document.getElementById('resume-viewer');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        if (viewer) viewer.style.opacity = '1';
                    }, 400);
                }, 300);
            }
        };
    }

    /* ==========================================================================
       NAV ACTIVE STATE
       ========================================================================== */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ==========================================================================
       MOBILE HAMBURGER MENU
       ========================================================================== */
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    function closeMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                hamburger.classList.add('active');
                navLinks.classList.add('open');
                if (navOverlay) navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ==========================================================================
       TYPEWRITER ANIMATION — Hero tagline cycles through phrases
       ========================================================================== */
    const scrambleTextEl = document.querySelector('.scramble-text');
    if (scrambleTextEl) {
        const phrases = ['I design silicon.', 'I speak in Verilog.', 'I build at gate level.'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const pauseTime = 2000;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            scrambleTextEl.textContent = currentPhrase.substring(0, charIndex);

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
            }
        }

        setTimeout(type, 500);
    }

    /* ==========================================================================
       CARD TILT EFFECT ON HOVER
       ========================================================================== */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) * 0.02;
            const rotateY = (centerX - x) * 0.02;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-4px)';
        });
    });

    /* ==========================================================================
       PARALLAX HERO IMAGE
       ========================================================================== */
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            profileImage.style.transform = `translateY(${scrollY * 0.3}px)`;
        }, { passive: true });
    }

    /* ==========================================================================
       GLITCH EFFECT ON HERO NAME (on page load)
       ========================================================================== */
    const navName = document.querySelector('.nav-name');
    if (navName) {
        function triggerGlitch() {
            const originalText = navName.textContent;
            navName.style.animation = 'none';

            setTimeout(() => {
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => {
                        const glitchText = originalText
                            .split('')
                            .map(() => String.fromCharCode(65 + Math.random() * 26))
                            .join('');
                        navName.textContent = glitchText;
                    }, i * 30);
                }

                setTimeout(() => {
                    navName.textContent = originalText;
                }, 150);
            }, 100);
        }

        triggerGlitch();
    }

    /* ==========================================================================
       ANIMATED NUMBER COUNTER
       ========================================================================== */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-count'));
                if (isNaN(endValue)) return;

                const duration = 1500;
                const startTime = performance.now();
                const startValue = 0;

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - (1 - progress) * (1 - progress);
                    const current = Math.floor(startValue + (endValue - startValue) * eased);
                    target.textContent = current + (target.getAttribute('data-suffix') || '');

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = endValue + (target.getAttribute('data-suffix') || '');
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.impact-number[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

});
