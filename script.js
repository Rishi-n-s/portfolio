gsap.registerPlugin(ScrollTrigger);

// Hero Animations
gsap.from(".hero-name", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    skewY: 10,
    ease: "power4.out",
    delay: 0.5
});

gsap.from(".developer-img", {
    scale: 1.2,
    opacity: 0,
    duration: 2,
    ease: "power4.out"
});

// Parallax Ghost Text
gsap.to(".ghost-text", {
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    x: -200,
    opacity: 0.2
});

// Expertise Section Animations
gsap.from(".exp-text h2", {
    scrollTrigger: {
        trigger: "#expertise",
        start: "top 80%",
    },
    y: 50,
    opacity: 0,
    skewY: 5,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".exp-visual", {
    scrollTrigger: {
        trigger: "#expertise",
        start: "top 80%",
    },
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
});

// Project Horizontal Scroll
const projectSection = document.querySelector("#projects");
const horizontalScroll = document.querySelector(".horizontal-scroll");

// Note: On small screens, we might want standard scroll. 
// For now, let's just make the cards reveal on scroll.
gsap.from(".project-card", {
    scrollTrigger: {
        trigger: "#projects",
        start: "top 80%",
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// Footer Reveal
gsap.from(".footer-link", {
    scrollTrigger: {
        trigger: "#footer",
        start: "top 90%",
    },
    y: 100,
    opacity: 0,
    skewY: 10,
    duration: 1,
    ease: "power4.out"
});

// Navigation Background on Scroll
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.style.backgroundColor = "rgba(0,0,0,0.8)";
        nav.style.backdropFilter = "blur(10px)";
    } else {
        nav.style.backgroundColor = "transparent";
        nav.style.backdropFilter = "none";
    }
});

// Smooth Scroll to Top
document.querySelector(".footer-bottom p:last-child").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Custom Mouse Follower (Optional for high-end feel)
const follower = document.createElement("div");
follower.style.cssText = `
    width: 20px;
    height: 20px;
    background: var(--accent-color);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.1s;
    opacity: 0.5;
`;
document.body.appendChild(follower);

window.addEventListener("mousemove", (e) => {
    gsap.to(follower, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.1
    });
});
