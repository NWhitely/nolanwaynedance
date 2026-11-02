/* ==========================================================================
   Nolan Wayne Dance, shared interactions. Loaded on every page.
   Everything here is enhancement: the pages work without it.
   ========================================================================== */
(function () {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme: follows the system until the visitor picks one ---------- */
    const KEY = 'nwd-theme';
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const dark = root.getAttribute('data-theme') === 'dark' ||
                (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
            const next = dark ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem(KEY, next); } catch (e) {}
        });
    }

    /* ---------- Nav: solid after the hero, hides on scroll down ---------- */
    const nav = document.querySelector('.nav');
    const menuBtn = document.getElementById('menuBtn');
    let lastY = 0;
    function onScroll() {
        const y = window.scrollY;
        if (nav && !nav.classList.contains('menu-open')) {
            nav.classList.toggle('is-solid', y > window.innerHeight * 0.6);
            nav.classList.toggle('is-hidden', y > 300 && y > lastY + 4);
            if (y < lastY - 4) nav.classList.remove('is-hidden');
        }
        lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            const open = nav.classList.toggle('menu-open');
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuBtn.textContent = open ? 'Close' : 'Menu';
            document.body.style.overflow = open ? 'hidden' : '';
        });
        nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => {
            nav.classList.remove('menu-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.textContent = 'Menu';
            document.body.style.overflow = '';
        }));
    }

    /* ---------- Quiet reveal ---------- */
    const rv = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -8% 0px' });
        rv.forEach((el) => io.observe(el));
    } else {
        rv.forEach((el) => el.classList.add('in'));
    }

    /* ---------- The line of dance ----------
       One red line travels the page. It runs down the margin on the side of
       each section's count, and crosses the floor in the open space between
       sections. It draws itself as you move down the page. */
    const sections = Array.from(document.querySelectorAll('[data-count]'));
    if (sections.length) {
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'lod');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(NS, 'path');
        const tip = document.createElementNS(NS, 'circle');
        tip.setAttribute('class', 'lod-tip');
        tip.setAttribute('r', '4');
        svg.appendChild(path);
        const marks = document.createElementNS(NS, 'g');
        svg.appendChild(marks);
        svg.appendChild(tip);
        document.body.prepend(svg);

        let total = 0;
        let samples = [];

        function build() {
            const docH = document.documentElement.scrollHeight;
            const W = document.documentElement.clientWidth;
            const gutter = parseFloat(getComputedStyle(document.querySelector('.wrap') || document.body).paddingLeft) || 24;
            const wrapEl = document.querySelector('.sec .wrap');
            const wrapRect = wrapEl ? wrapEl.getBoundingClientRect() : { left: gutter, right: W - gutter };
            const inset = Math.max(8, Math.min(gutter * 0.45, 48));
            const edge = W < 600 ? 5 : 6;
            const leftX = Math.max(edge, wrapRect.left + gutter - inset - 18);
            const rightX = Math.min(W - edge, wrapRect.right - gutter + inset + 18);
            const sy = window.scrollY;

            svg.setAttribute('width', W);
            svg.setAttribute('height', docH);
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + docH);
            svg.style.height = docH + 'px';
            while (marks.firstChild) marks.removeChild(marks.firstChild);

            let d = '';
            let prev = null;
            sections.forEach((sec, i) => {
                const r = sec.getBoundingClientRect();
                const head = sec.querySelector('.sec-head, [data-lod-head]') || sec;
                const hr = head.getBoundingClientRect();
                const side = sec.getAttribute('data-side') === 'right' ? rightX : leftX;
                const top = hr.top + sy + Math.min(hr.height * 0.35, 60);
                const bottom = r.bottom + sy - 24;
                if (!prev) {
                    d += 'M' + side + ',' + (r.top + sy + 8);
                    d += ' L' + side + ',' + top;
                } else {
                    const k = Math.max(40, (top - prev.y) * 0.55);
                    d += ' C' + prev.x + ',' + (prev.y + k) + ' ' + side + ',' + (top - k) + ' ' + side + ',' + top;
                }
                const mark = document.createElementNS(NS, 'circle');
                mark.setAttribute('class', 'lod-mark');
                mark.setAttribute('cx', side);
                mark.setAttribute('cy', top);
                mark.setAttribute('r', W < 600 ? '3.5' : '5');
                marks.appendChild(mark);
                const end = i === sections.length - 1 ? bottom : bottom - Math.min(140, (r.height) * 0.12);
                d += ' L' + side + ',' + end;
                prev = { x: side, y: end };
            });
            path.setAttribute('d', d);
            total = path.getTotalLength();
            path.style.strokeDasharray = total + ' ' + total;
            samples = [];
            const N = 600;
            for (let i = 0; i <= N; i++) {
                const len = (total * i) / N;
                samples.push({ len, y: path.getPointAtLength(len).y });
            }
            draw();
        }

        function lengthAtY(y) {
            if (!samples.length) return 0;
            if (y <= samples[0].y) return 0;
            for (let i = 1; i < samples.length; i++) {
                if (samples[i].y >= y) return samples[i].len;
            }
            return total;
        }

        let ticking = false;
        function draw() {
            ticking = false;
            const target = reduce ? Infinity : window.scrollY + window.innerHeight * 0.72;
            const len = Math.min(total, lengthAtY(target));
            path.style.strokeDashoffset = String(total - len);
            const p = path.getPointAtLength(len);
            tip.setAttribute('cx', p.x);
            tip.setAttribute('cy', p.y);
            tip.style.opacity = len >= total ? '0' : '1';
        }
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }, { passive: true });

        let resizeT;
        const rebuild = () => { clearTimeout(resizeT); resizeT = setTimeout(build, 120); };
        window.addEventListener('resize', rebuild);
        window.addEventListener('load', build);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
        if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(document.body);
        document.querySelectorAll('details').forEach((dt) => dt.addEventListener('toggle', rebuild));
        build();
    }

    /* ---------- Autoplaying videos pause while off screen ---------- */
    if ('IntersectionObserver' in window) {
        const vio = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { const p = e.target.play(); if (p && p.catch) p.catch(() => {}); }
                else e.target.pause();
            });
        });
        document.querySelectorAll('video[autoplay]').forEach((v) => vio.observe(v));
    }

    /* ---------- Forms (Web3Forms) ---------- */
    document.querySelectorAll('form.web3-form').forEach((form) => {
        const result = form.querySelector('.form-result');
        const btn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const label = btn ? btn.innerHTML : '';
            if (result) { result.hidden = false; result.className = 'form-result'; result.textContent = 'Sending...'; }
            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
            try {
                const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || 'failed');
                if (result) result.textContent = form.dataset.success || "Got it. I'll be in touch.";
                form.reset();
            } catch (err) {
                if (result) {
                    result.className = 'form-result error';
                    result.innerHTML = 'That didn\'t send. Try again in a minute, or message me on Instagram at <a href="https://instagram.com/n.wayne_" target="_blank" rel="noopener">@n.wayne_</a>.';
                }
            } finally {
                if (btn) { btn.disabled = false; btn.innerHTML = label; }
            }
        });
    });

    /* ---------- Gallery lightbox (weddings) ---------- */
    const albumItems = document.querySelectorAll('.album figure');
    if (albumItems.length) {
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.innerHTML = '<button class="lightbox-close" type="button">Close</button><div><img alt=""><p class="lightbox-caption"></p></div>';
        document.body.appendChild(lb);
        const img = lb.querySelector('img');
        const cap = lb.querySelector('.lightbox-caption');
        const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
        albumItems.forEach((f) => f.addEventListener('click', () => {
            const i = f.querySelector('img');
            img.src = i.currentSrc || i.src;
            img.alt = i.alt;
            cap.textContent = i.alt;
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        }));
        lb.querySelector('.lightbox-close').addEventListener('click', close);
        lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    /* ---------- First dance planner (weddings) ----------
       Consultation a week before the first lesson; first lesson about ten
       weeks out (the FAQ says two to three months); final run-through a week
       before the wedding. */
    const dateIn = document.getElementById('plannerDate');
    if (dateIn) {
        const sheet = document.querySelector('.run-sheet');
        const note = document.querySelector('.planner-note');
        const cta = document.querySelector('.planner-cta');
        const DAY = 86400000;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        dateIn.min = iso(new Date(today.getTime() + DAY));
        const fmt = (d, y) => d.toLocaleDateString('en-US', y ? { month: 'short', day: 'numeric', year: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric' });
        const set = (k, v) => { sheet.querySelector('[data-step="' + k + '"]').textContent = v; };
        let chosen = null;
        dateIn.addEventListener('change', () => {
            const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIn.value);
            if (!m) return;
            const wed = new Date(+m[1], +m[2] - 1, +m[3]);
            const days = Math.round((wed - today) / DAY);
            chosen = wed;
            sheet.classList.add('ready');
            if (days <= 0) {
                ['consult', 'start', 'final', 'day'].forEach((k) => set(k, '-'));
                note.textContent = 'That date has passed. Pick an upcoming one.';
                return;
            }
            const start = new Date(wed.getTime() - 70 * DAY);
            const consult = new Date(start.getTime() - 7 * DAY);
            set('day', fmt(wed, true));
            set('final', days > 10 ? fmt(new Date(wed.getTime() - 7 * DAY)) : 'Day before');
            if (days < 21) {
                set('consult', 'Today'); set('start', 'This week');
                note.textContent = 'Tight, and doable. We keep the routine simple and drill what matters. Book today.';
            } else if (consult <= today) {
                set('consult', 'This week'); set('start', 'Next week');
                note.textContent = 'You are inside the ideal window. Most couples need 4 to 6 lessons. Start now.';
            } else {
                set('consult', fmt(consult)); set('start', fmt(start));
                note.textContent = 'Plenty of time. Booking early secures the lesson times you want.';
            }
        });
        if (cta) cta.addEventListener('click', () => {
            const f = document.querySelector('#contact input[name="wedding_date"]');
            if (f && chosen && !f.value) f.value = chosen.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        });
    }

    /* ---------- For the developers who open the console ---------- */
    try {
        console.log('%cNolan Wayne Dance%c\nDesigned and built by hand by Wayne Studios.\nhttps://waynestudios.dev',
            'font: 800 22px "Arial Narrow", Impact, sans-serif; letter-spacing: 1px; color: #a3301d;',
            'font: 12px/1.6 system-ui, sans-serif; color: #57504a;');
    } catch (e) {}

    /* ---------- Easter egg: up up down down left right left right B A ---------- */
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
        if (pos < code.length) return;
        pos = 0;
        document.body.classList.remove('two-stepping');
        void document.body.offsetWidth;
        document.body.classList.add('two-stepping');
        let t = document.querySelector('.egg-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'egg-toast';
            t.setAttribute('role', 'status');
            t.innerHTML = 'Quick, quick, slow, slow. Built by <a href="https://waynestudios.dev" target="_blank" rel="noopener">Wayne Studios</a>.';
            document.body.appendChild(t);
        }
        requestAnimationFrame(() => t.classList.add('show'));
        clearTimeout(t._h);
        t._h = setTimeout(() => t.classList.remove('show'), 4200);
    });
})();
