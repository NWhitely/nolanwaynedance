/* ==========================================================================
   Nolan Wayne Dance, shared interactions
   Loaded on every page (home, weddings, lessons).
   Safe to load on pages that don't have every element (guards included).
   ========================================================================== */

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Navbar scroll effect & scroll progress bar
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    // Navbar shadow
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Scroll progress bar
    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }
});

// Fade-in animations on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-stagger').forEach(el => {
    fadeObserver.observe(el);
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Web3Forms contact forms: AJAX submit with inline success/error message
// (keeps the visitor on the page instead of redirecting to Web3Forms)
document.querySelectorAll('form.web3-form').forEach(form => {
    const result = form.querySelector('.form-result');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalBtnText = submitBtn ? submitBtn.textContent : '';

        if (result) {
            result.hidden = false;
            result.className = 'form-result sending';
            result.textContent = 'Sending...';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });
            const data = await response.json();

            if (response.ok && data.success) {
                if (result) {
                    result.className = 'form-result success';
                    result.textContent = form.dataset.success || "Thank you! Your message is on its way. I'll be in touch soon.";
                }
                form.reset();
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (err) {
            if (result) {
                result.className = 'form-result error';
                result.innerHTML = 'Something went wrong. Please try again in a minute, or message me on Instagram at <a href="https://instagram.com/n.wayne_" target="_blank" rel="noopener">@n.wayne_</a>.';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
});

// Smooth scroll for same-page anchor links (cross-page links like
// "index.html#about" are left to the browser's default navigation)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            if (window.__lenis) {
                window.__lenis.scrollTo(target, { offset: -64, duration: 1.6 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Gallery lightbox: click any gallery image to view it full-size.
// Builds one overlay and reuses it; no per-page markup needed.
(function () {
    const galleryImgs = document.querySelectorAll('.gallery-item img');
    if (!galleryImgs.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<img alt="">' +
        '<div class="lightbox-caption"></div>';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, alt, caption) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        lbCaption.textContent = caption || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    galleryImgs.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            // Prefer a higher-res version if the URL carries a width param
            const fullSrc = img.src.replace(/([?&]w=)\d+/, '$11600');
            const overlay = img.closest('.gallery-item').querySelector('.gallery-item-overlay');
            const caption = overlay ? overlay.textContent.trim().replace(/\s+/g, ' ') : img.alt;
            openLightbox(fullSrc, img.alt, caption);
        });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
})();

/* ==========================================================================
   Theme toggle — noir (dark) is the brand default; light is opt-in and persists.
   (A tiny inline script in <head> applies the saved choice before paint.)
   ========================================================================== */
(function () {
    const root = document.documentElement;
    const KEY = 'nwd-theme';
    const toggle = document.getElementById('themeToggle');

    const isDark = () => root.getAttribute('data-theme') !== 'light';
    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = isDark() ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem(KEY, next); } catch (e) {}
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });
    }
})();

/* ==========================================================================
   Cinematic motion — Lenis smooth scroll + GSAP ScrollTrigger.
   Progressive enhancement: if libs are missing or reduced-motion is set,
   we bail and the IntersectionObserver fade-ins above carry the page.
   ========================================================================== */
(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // NOTE: reveals are handled by the reliable IntersectionObserver above
    // (.fade-in / .fade-in-stagger). GSAP is used ONLY for non-destructive
    // enhancements here, so nothing can ever get stuck invisible.

    const nav = document.getElementById('navbar');

    // Smooth scroll with a long, glassy glide (low lerp = more glide).
    if (window.Lenis) {
        const lenis = new Lenis({ lerp: 0.05, wheelMultiplier: 1, smoothWheel: true, autoRaf: false });
        window.__lenis = lenis;
        function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);

        let last = 0;
        lenis.on('scroll', ({ scroll }) => {
            if (nav) {
                if (scroll > 140 && scroll > last) nav.classList.add('nav-hidden');
                else nav.classList.remove('nav-hidden');
            }
            last = scroll;
        });
    }

    // GSAP parallax — enhancement only (if it no-ops, images simply sit still).
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        if (window.__lenis) window.__lenis.on('scroll', ScrollTrigger.update);

        // Home hero: the photo drifts slower than the page as you scroll down it,
        // and the headline fades out over the first screen.
        const hero = document.querySelector('.noir-hero');
        if (hero) {
            gsap.to('.noir-hero-img', {
                yPercent: 16, ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
            });
            gsap.to('.noir-hero-content', {
                autoAlpha: 0, y: -48, ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + window.innerHeight * 0.6, scrub: true }
            });
        }

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    }
})();

/* ==========================================================================
   Testimonials: "See more reviews" expander (curated 6 + reveal the rest)
   ========================================================================== */
document.querySelectorAll('.reviews-more').forEach((btn) => {
    const section = btn.closest('.testimonials');
    const grid = section && section.querySelector('.testimonial-grid');
    if (!grid) return;
    const extras = grid.querySelectorAll('.testimonial.is-extra').length;
    if (!extras) { const w = btn.closest('.reviews-more-wrap'); if (w) w.style.display = 'none'; return; }
    const label = 'See ' + extras + ' more reviews';
    btn.textContent = label;
    btn.addEventListener('click', () => {
        const open = grid.classList.toggle('reviews-open');
        btn.textContent = open ? 'Show fewer' : label;
        if (!open) {
            if (window.__lenis) window.__lenis.scrollTo(section, { offset: -64 });
            else section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ==========================================================================
   Premium polish (enhancement only; nothing here is needed to use the site)
   ========================================================================== */
(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hasIO = 'IntersectionObserver' in window;

    // Section headlines: wrap each word so it can rise from behind a mask.
    // The parent .section-header already gets .visible from the fade-in observer.
    if (!reduce && hasIO) {
        document.querySelectorAll('.section-header h2').forEach((h) => {
            if (h.children.length) return; // only plain-text headlines
            const text = h.textContent.trim();
            h.setAttribute('aria-label', text);
            h.innerHTML = text.split(/\s+/).map((w, i) =>
                '<span class="split-word" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>'
            ).join(' ');
            h.classList.add('is-split');
        });
    }

    // Photo and video frames open like a curtain the first time they scroll into view.
    if (!reduce && hasIO) {
        const frames = document.querySelectorAll('.about-image, .dwts-media, .video-frame');
        // Observe the parent: a clipped element reports itself as invisible to the observer.
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target._curtain.classList.add('is-in'); io.unobserve(e.target); }
            });
        }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });
        frames.forEach((f) => {
            // Skip anything already on screen at load, so nothing flashes in late.
            if (!f.parentElement || f.getBoundingClientRect().top < window.innerHeight * 0.9) return;
            f.classList.add('curtain');
            f.parentElement._curtain = f;
            io.observe(f.parentElement);
        });
    }

    // Cards: a soft light follows the cursor (desktop only).
    if (finePointer) {
        document.querySelectorAll('.testimonial, .format, .step, .genre-card, .path-card').forEach((card) => {
            card.classList.add('spot');
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--px', (e.clientX - r.left) + 'px');
                card.style.setProperty('--py', (e.clientY - r.top) + 'px');
            });
        });
    }

    // Buttons lean a few pixels toward the cursor (desktop only).
    if (finePointer && !reduce) {
        document.querySelectorAll('.btn').forEach((btn) => {
            btn.addEventListener('pointermove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
                const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
                btn.style.setProperty('--mx', (x * 5).toFixed(2) + 'px');
                btn.style.setProperty('--my', (y * 4).toFixed(2) + 'px');
            });
            btn.addEventListener('pointerleave', () => {
                btn.style.setProperty('--mx', '0px');
                btn.style.setProperty('--my', '0px');
            });
        });
    }

    // Price counts up once when it scrolls into view.
    if (!reduce && hasIO) {
        document.querySelectorAll('.price-display').forEach((el) => {
            const node = el.firstChild;
            if (!node || node.nodeType !== 3) return;
            const m = node.textContent.match(/^(\s*\$)(\d+)(.*)$/s);
            if (!m) return;
            const target = parseInt(m[2], 10);
            const io = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) return;
                io.disconnect();
                const start = performance.now(), dur = 1400;
                const tick = (t) => {
                    const p = Math.min(1, (t - start) / dur);
                    const eased = 1 - Math.pow(1 - p, 4);
                    node.textContent = m[1] + Math.round(target * eased) + m[3];
                    if (p < 1) requestAnimationFrame(tick);
                };
                node.textContent = m[1] + '0' + m[3];
                requestAnimationFrame(tick);
            }, { threshold: 0.6 });
            io.observe(el);
        });
    }

    // Autoplaying hero videos pause while off screen (saves battery and CPU).
    if (hasIO) {
        const vio = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                const v = e.target;
                if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
                else v.pause();
            });
        });
        document.querySelectorAll('video[autoplay]').forEach((v) => vio.observe(v));
    }

    // For the developers who open the console.
    try {
        console.log(
            '%cNolan Wayne Dance%c\nDesigned and built by hand by Wayne Studios.\nWant a site like this? https://waynestudios.dev',
            'font: 600 20px Georgia, serif; color: #d6bb8c; padding: 6px 0;',
            'font: 12px/1.6 system-ui, sans-serif; color: #a39b91;'
        );
    } catch (e) {}

    // Easter egg: up, up, down, down, left, right, left, right, B, A.
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = (k === code[pos]) ? pos + 1 : (k === code[0] ? 1 : 0);
        if (pos < code.length) return;
        pos = 0;
        document.body.classList.remove('two-stepping');
        void document.body.offsetWidth;
        document.body.classList.add('two-stepping');
        let toast = document.querySelector('.egg-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'egg-toast';
            toast.setAttribute('role', 'status');
            toast.innerHTML = 'Quick, quick, slow, slow. Site by <a href="https://waynestudios.dev" target="_blank" rel="noopener">Wayne Studios</a>.';
            document.body.appendChild(toast);
        }
        requestAnimationFrame(() => toast.classList.add('show'));
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), 4200);
    });
})();

/* ==========================================================================
   First dance planner (weddings page): pick a date, see when to start.
   Plan: consultation a week before the first lesson, first lesson about
   10 weeks out (the FAQ says 2-3 months), final run-through a week before.
   ========================================================================== */
(function () {
    const input = document.getElementById('plannerDate');
    if (!input) return;
    const result = input.closest('.planner-card').querySelector('.planner-result');
    const note = result.querySelector('.planner-note');
    const cta = result.querySelector('.planner-cta');
    const DAY = 86400000;
    const fmt = (d, year) => d.toLocaleDateString('en-US', year
        ? { month: 'short', day: 'numeric', year: 'numeric' }
        : { weekday: 'short', month: 'short', day: 'numeric' });
    const set = (k, v) => { result.querySelector('[data-step="' + k + '"]').textContent = v; };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    input.min = new Date(today.getTime() + DAY).toISOString().slice(0, 10);

    let chosen = null;
    input.addEventListener('change', () => {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.value);
        if (!m) return;
        const wedding = new Date(+m[1], +m[2] - 1, +m[3]);
        const days = Math.round((wedding - today) / DAY);
        chosen = wedding;

        result.hidden = false;
        result.classList.remove('show');
        void result.offsetWidth;

        if (days <= 0) {
            note.textContent = "That date has already passed. Pick an upcoming one.";
            ['consult', 'start', 'final', 'day'].forEach((k) => set(k, '-'));
            requestAnimationFrame(() => result.classList.add('show'));
            return;
        }

        const start = new Date(wedding.getTime() - 70 * DAY);
        const consult = new Date(start.getTime() - 7 * DAY);
        const final = new Date(wedding.getTime() - 7 * DAY);
        set('day', fmt(wedding, true));
        set('final', days > 10 ? fmt(final) : 'Day before');

        if (days < 21) {
            set('consult', 'Today');
            set('start', 'This week');
            note.textContent = "That's close, but I've done it. We'll keep the dance simple and go straight to the parts that matter. Reach out today.";
        } else if (consult <= today) {
            set('consult', 'This week');
            set('start', 'Next week');
            note.textContent = "You're inside the ideal window, so let's get started soon. Most couples need 4-6 lessons.";
        } else {
            set('consult', fmt(consult));
            set('start', fmt(start));
            note.textContent = "Plenty of time. Booking early gets you the lesson times you want.";
        }
        requestAnimationFrame(() => result.classList.add('show'));
    });

    // Carry the date into the contact form so they don't type it twice.
    cta.addEventListener('click', () => {
        const field = document.querySelector('#contact input[name="wedding_date"]');
        if (field && chosen && !field.value) {
            field.value = chosen.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
    });
})();
