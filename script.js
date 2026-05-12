document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME — persist in localStorage, default dark
       ========================================================================== */
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

    window.toggleTheme = function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = next === 'light' ? '☀️' : '🌙';
    };

    /* ==========================================================================
       SCROLL PROGRESS BAR
       ========================================================================== */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position:fixed; top:0; left:0; height:2px; z-index:2000;
        background:linear-gradient(90deg, #E8A020, #F5B840);
        width:0%; transition:width 0.08s linear;
        pointer-events:none;
        box-shadow:0 0 10px rgba(232,160,32,0.5);
    `;
    document.body.appendChild(progressBar);

    /* ==========================================================================
       SCROLL REVEAL — Intersection Observer
       ========================================================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .section-divider').forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       SCROLL HANDLER — progress bar + back to top
       ========================================================================== */
    const backToTop = document.getElementById('back-to-top');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                progressBar.style.width = docHeight > 0 ? `${(scrolled / docHeight) * 100}%` : '0%';

                if (backToTop) {
                    backToTop.classList.toggle('visible', scrolled > 480);
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }

    /* ==========================================================================
       RESUME MODAL
       ========================================================================== */
    window.openResume = function () {
        const modal = document.getElementById('resume-modal');
        const loader = document.getElementById('resume-loader');
        const viewer = document.getElementById('resume-viewer');
        const iframe = viewer ? viewer.querySelector('iframe') : null;

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (loader) { loader.style.opacity = '1'; loader.style.display = 'flex'; }
            if (iframe) {
                iframe.src = '';
                iframe.src = 'Vineet_Jethani.pdf';
            }
        }
    };

    window.closeResume = function () {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') window.closeResume();
    });

    const resumeIframe = document.querySelector('#resume-modal iframe');
    if (resumeIframe) {
        resumeIframe.onload = function () {
            const loader = document.getElementById('resume-loader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => { loader.style.display = 'none'; }, 400);
                }, 300);
            }
        };
    }

    /* ==========================================================================
       MOBILE HAMBURGER MENU
       ========================================================================== */
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks  = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    function closeMenu() {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('open');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', () => {
        const isOpen = navLinks?.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navLinks?.classList.add('open');
            navOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    navOverlay?.addEventListener('click', closeMenu);
    navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    /* ==========================================================================
       NAV ACTIVE STATE
       ========================================================================== */
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile || (currentFile === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ==========================================================================
       CARD 3D TILT — subtle perspective on hover
       ========================================================================== */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * 2.5;
            const rotY = ((cx - x) / cx) * 2.5;
            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ==========================================================================
       HERO PARALLAX — subtle profile image offset on scroll
       ========================================================================== */
    const heroFrame = document.querySelector('.hero-image-frame');
    if (heroFrame) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight * 1.2) {
                heroFrame.style.transform = `translateY(${y * 0.08}px)`;
            }
        }, { passive: true });
    }

    /* ==========================================================================
       ANIMATED COUNTER — elements with data-count attribute
       ========================================================================== */
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const end = parseFloat(el.getAttribute('data-count'));
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = el.getAttribute('data-decimals') || 0;
            if (isNaN(end)) return;

            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                const val = (end * eased).toFixed(decimals);
                el.textContent = val + suffix;
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = end.toFixed(decimals) + suffix;
            }

            requestAnimationFrame(tick);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

    /* ==========================================================================
       SMOOTH SCROLL — for anchor links
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================================
       HERO ENTRANCE ANIMATION — stagger on first load
       ========================================================================== */
    const heroReveal = document.querySelector('.hero .reveal');
    if (heroReveal) {
        heroReveal.style.opacity = '0';
        heroReveal.style.transform = 'translateY(24px)';
        setTimeout(() => {
            heroReveal.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
            heroReveal.style.opacity = '1';
            heroReveal.style.transform = 'translateY(0)';
        }, 80);
    }

    /* ==========================================================================
       CONTACT FORM — success feedback
       ========================================================================== */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = 'Sending…';
                btn.disabled = true;
            }
        });
    }

    /* ==========================================================================
       SKILL TAG — stagger appearance when entering viewport
       ========================================================================== */
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const tags = entry.target.querySelectorAll('.skill-tag');
            tags.forEach((tag, i) => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(8px)';
                setTimeout(() => {
                    tag.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, i * 45);
            });
            skillObs.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-tags').forEach(el => skillObs.observe(el));

    /* ==========================================================================
       CURSOR GLOW — subtle amber glow follows mouse on desktop
       ========================================================================== */
    if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position:fixed; pointer-events:none; z-index:9999;
            width:300px; height:300px; border-radius:50%;
            background:radial-gradient(circle, rgba(232,160,32,0.04) 0%, transparent 70%);
            transform:translate(-50%,-50%);
            transition:left 0.15s ease, top 0.15s ease;
            will-change:left,top;
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', e => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }, { passive: true });
    }

});
