document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       SCROLL REVEAL — Intersection Observer with stagger
       ========================================================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // animate once
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
       SMOOTH SCROLL PROGRESS — Thin line at top of page
       ========================================================================== */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 1px; z-index: 1001;
        background: var(--border); width: 0%; transition: width 0.1s linear;
        pointer-events: none;
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

                // Back to top visibility
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
       THEME TOGGLE — Clean swap, no bloom
       ========================================================================== */
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    };

    // Restore saved theme
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

    // Close modal with Escape key
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
       NAV ACTIVE STATE — Highlight current page
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

    // Close menu when a link is clicked
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ==========================================================================
       ANIMATED NUMBER COUNTER — Stats count up on scroll
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
                    // Ease out quad
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
