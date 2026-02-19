
const PROJECTS = [
    { id: 1, title: "Average Calculator", desc: "Compute sum and average of two integers.", link: "../practical/avaerage.html" },
    { id: 2, title: "Metric Converter", desc: "Convert meters into kilometers seamlessly.", link: "../practical/kilometer.html" },
    { id: 3, title: "Prime Verifier", desc: "Efficient algorithm to verify prime numbers.", link: "../practical/prime.html" },
    { id: 4, title: "Temporal Display", desc: "Dynamic real-time display of date and time.", link: "../practical/time.html" },
    { id: 5, title: "String Architect", desc: "Algorithm to swap characters with length checks.", link: "../practical/string_swap.html" },
    { id: 6, title: "Pattern Engine", desc: "Nested loop implementation for visual patterns.", link: "../practical/star pattern.html" },
    { id: 7, title: "Interactive Hue", desc: "Background color dynamics on mouse interaction.", link: "../practical/change_color.html" },
    { id: 8, title: "Precision Clock", desc: "A sleek digital clock updating per second.", link: "../practical/digital_clock.html" },
    { id: 9, title: "Universal Dropdown", desc: "Polished pull-down (drop-down) menu system.", link: "../practical/drop_down/drop.html" },
    { id: 10, title: "Form Sentinel", desc: "Robust HTML form verification logic.", link: "../practical/login_page.html" },
    { id: 11, title: "State Manager", desc: "jQuery implementation for button states.", link: "#" },
    { id: 12, title: "Event Guard", desc: "Disabling browser events like right-click.", link: "#" },
    { id: 13, title: "Kinetic Text", desc: "Text blink effects using jQuery animations.", link: "#" },
    { id: 14, title: "Bootstrap Flow", desc: "Bootstrap design integrated with jQuery.", link: "#" },
    { id: 15, title: "Form Master", desc: "Modern architectural forms using Bootstrap.", link: "#" },
    { id: 16, title: "Async Pulse", desc: "jQuery AJAX implementation for submissions.", link: "#" },
    { id: 17, title: "Live Feedback", desc: "Displaying AJAX responses without refreshes.", link: "#" },
    { id: 18, title: "On-Click Fetch", desc: "Data fetch on interaction using AJAX.", link: "#" },
    { id: 19, title: "Flappy Bird", desc: "A browser-based Flappy Bird game using HTML Canvas.", link: "../practical/flappy_bird.html" },
    { id: 20, title: "Spider-Man Media", desc: "Spider-Man themed movie and series showcase page.", link: "../practical/drop_down/spiderman.html" }
];

const SKILLS = [
    { name: "Web Swinging (HTML/CSS)", level: 95 },
    { name: "Reaction Time (JavaScript)", level: 88 },
    { name: "Adaptive UI (UX Design)", level: 92 },
    { name: "Core Architecture (Logic)", level: 90 }
];

// --- 2. INITIALIZATION ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
    initMissions();
    initTechSuit();
    initSkyline();
    initCursor();
    init3DTilt();
    initScrollEngine();
});

// --- 3. MISSIONS (PROJECTS) ENGINE ---
const initMissions = () => {
    const grid = document.getElementById('mission-grid');
    const search = document.getElementById('mission-search');

    const render = (items) => {
        if (!grid) return;
        grid.innerHTML = items.map((p, index) => `
            <article class="mission-card" style="animation: swingIn 0.8s var(--ease-spidey) forwards ${index * 0.05}s; opacity: 0;">
                <span class="num">${p.id.toString().padStart(2, '0')}</span>
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <a href="${p.link}" class="intel-link">Open Intel &rarr;</a>
            </article>
        `).join('');
    };

    console.log("Mission Engine: Rendering projects...", PROJECTS.length);
    render(PROJECTS);

    if (search) {
        search.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = PROJECTS.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.desc.toLowerCase().includes(term)
            );
            render(filtered);
        });
    }
};

// --- 4. TECH SUIT (SKILLS) ENGINE ---
const initTechSuit = () => {
    const list = document.getElementById('tech-list');
    if (!list) return;

    list.innerHTML = SKILLS.map(s => `
        <div class="skill-item">
            <div class="skill-info">
                <span>${s.name}</span>
                <span>${s.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-fill" style="width: 0%" data-level="${s.level}"></div>
            </div>
        </div>
    `).join('');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach(f => f.style.width = f.dataset.level + '%');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(document.getElementById('tech-suit'));
};


// --- 6.5 3D TILT (Mouse Tracking Profile) ---
const init3DTilt = () => {
    const scene = document.getElementById('profile3d');
    const card = scene?.querySelector('.profile-3d-card');
    if (!scene || !card) return;

    scene.addEventListener('mousemove', (e) => {
        const rect = scene.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Normalize mouse position (-1 to 1)
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        // Apply tilt: max 20 degrees
        const tiltX = -dy * 20;
        const tiltY = dx * 20;

        card.style.transform = `
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            translateZ(20px)
        `;
    });

    scene.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
};

// --- 7. UI INTERACTION ENGINE ---
const initCursor = () => {
    const main = document.getElementById('cursor-follower');
    const dot = document.getElementById('cursor-dot');
    if (!main || !dot) return;

    document.addEventListener('mousemove', (e) => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        setTimeout(() => {
            main.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        }, 50);
    });

    document.querySelectorAll('a, button, input').forEach(el => {
        el.addEventListener('mouseenter', () => main.style.transform += ' scale(2)');
        el.addEventListener('mouseleave', () => main.style.transform = main.style.transform.replace(' scale(2)', ''));
    });
};

const initSkyline = () => {
    const container = document.getElementById('skyline');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const b = document.createElement('div');
        b.className = 'building';
        b.style.height = (Math.random() * 50 + 10) + 'vh';
        container.appendChild(b);
    }
};

const initScrollEngine = () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const progress = document.querySelector('.scroll-progress-bar');
    const indicator = document.querySelector('.chapter-indicator');

    // Only use observer for NAV HIGHLIGHTING — not visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active nav link
                const id = entry.target.id;
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
                // Update chapter indicator
                const idx = Array.from(sections).indexOf(entry.target) + 1;
                if (indicator) indicator.textContent = `CH. 0${idx}`;
            }
        });
    }, { threshold: 0.1, rootMargin: '-10% 0px -10% 0px' });

    sections.forEach(s => observer.observe(s));

    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (progress) progress.style.width = (winScroll / height * 100) + "%";
    });
};
