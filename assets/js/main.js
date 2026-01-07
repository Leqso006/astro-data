gsap.registerPlugin(ScrollTrigger);

// --- PRELOADER ---
window.addEventListener("load", () => {
    // Wait for the bar animation to finish (approx 2s)
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000);
});

// --- CURSOR ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
});

document.querySelectorAll('a, .btn-neon, .viz-card, iframe').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 2, borderColor: '#00f3ff', duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, borderColor: '#bc13fe', duration: 0.2 });
    });
});

// --- SPACE BATTLE LOGIC ---
const battlefield = document.getElementById('battlefield');

function spawnShip(isAlly) {
    if (document.hidden) return;

    const ship = document.createElement('div');
    ship.classList.add('bg-ship');
    ship.classList.add(isAlly ? 'ship-ally' : 'ship-enemy');
    battlefield.appendChild(ship);

    const randomY = Math.random() * (window.innerHeight - 200) + 100;
    const startX = isAlly ? -100 : window.innerWidth + 100;
    const endX = isAlly ? window.innerWidth + 100 : -100;
    
    gsap.set(ship, { x: startX, y: randomY });
    const duration = Math.random() * 4 + 3;

    gsap.to(ship, {
        x: endX,
        duration: duration,
        ease: "none",
        onComplete: () => ship.remove()
    });

    const shootInterval = setInterval(() => {
        if(document.body.contains(ship)) {
            const currentX = gsap.getProperty(ship, "x");
            if (currentX > 0 && currentX < window.innerWidth) {
                fireAutoLaser(currentX, randomY, isAlly);
            }
        } else {
            clearInterval(shootInterval);
        }
    }, Math.random() * 600 + 400);
}

function fireAutoLaser(x, y, isAlly) {
    const laser = document.createElement('div');
    laser.classList.add('auto-laser');
    laser.classList.add(isAlly ? 'laser-ally' : 'laser-enemy');
    battlefield.appendChild(laser);

    const startX = isAlly ? x + 50 : x - 50;
    const startY = y + 18; 
    gsap.set(laser, { x: startX, y: startY });
    const destX = isAlly ? window.innerWidth + 200 : -200;

    gsap.to(laser, {
        x: destX, duration: 1.2, ease: "none",
        onComplete: () => laser.remove()
    });
}

setInterval(() => {
    if(Math.random() > 0.5) spawnShip(true); 
    if(Math.random() > 0.5) spawnShip(false); 
}, 1000);

// --- SCROLL ANIMATIONS ---
const tl = gsap.timeline();
tl.from(".hero-content h1", { y: 100, opacity: 0, duration: 1, ease: "power4.out", delay: 2.2 }) // Delay for preloader
  .from(".hero-content p", { y: 30, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
  .from(".btn-neon", { scale: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.5");

gsap.utils.toArray('.viz-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0, // This is what hides them initially
        duration: 1,
        ease: "power3.out"
    });
});

gsap.from(".section-title", {
    scrollTrigger: { trigger: ".section-title", start: "top 80%" },
    y: 50, opacity: 0, duration: 1
});