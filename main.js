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
                result.innerHTML = 'Something went wrong. Please try again, or email me directly at <a href="mailto:whitely.nolan@gmail.com">whitely.nolan@gmail.com</a>.';
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
