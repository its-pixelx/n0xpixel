"use strict";

const STORAGE_THEME_KEY = "n0xpixel-theme";

document.addEventListener("DOMContentLoaded", () => {
  initThemeSystem();
  initProfileImageFallback();
  initTypingEffect();
  initMobileMenu();
  initRevealVariants();
  initRevealAnimations();
  initActiveSectionHighlight();
  initSkillProgress();
  initCounters();
  initProjectTilt();
  initHeroParticles();
  initCursorGlow();
  initMagneticEffects();
  setCurrentYear();
});

function initThemeSystem() {
  const toggleButton = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-toggle-icon");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    document.body.classList.toggle("light-theme", isLight);

    if (icon) {
      icon.textContent = isLight ? "\u263D" : "\u2600";
    }
    if (toggleButton) {
      toggleButton.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    if (themeMeta) {
      themeMeta.setAttribute("content", isLight ? "#f6f6f8" : "#050505");
    }
  };

  const saveTheme = (theme) => {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  };

  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  }
}
function initProfileImageFallback() {
  const images = document.querySelectorAll("img[data-profile-image]");
  if (!images.length) return;

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0b0b0b' />
          <stop offset='100%' stop-color='#141414' />
        </linearGradient>
      </defs>
      <rect width='640' height='640' fill='url(#bg)' />
      <circle cx='320' cy='320' r='230' fill='none' stroke='#8b5cf6' stroke-width='5' opacity='0.72' />
      <text x='50%' y='52%' fill='#eaeaea' font-size='84' font-family='Inter,Arial,sans-serif' text-anchor='middle'>n0xpixel</text>
    </svg>
  `;
  const fallbackSource = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  images.forEach((image) => {
    image.addEventListener("error", () => {
      image.src = fallbackSource;
    });
  });
}

function initTypingEffect() {
  const phrases = [
    "Extreme Programmer",
    "Deep App Developer",
    "Advanced Web Architect",
    "Creative Digital Engineer"
  ];
  const element = document.getElementById("typing-text");
  if (!element) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = phrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    element.textContent = current.slice(0, charIndex);

    let timeout = deleting ? 48 : 72;
    if (!deleting && charIndex === current.length) {
      deleting = true;
      timeout = 780;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      timeout = 220;
    }

    window.setTimeout(type, timeout);
  };

  type();
}

function initMobileMenu() {
  const toggleButton = document.getElementById("nav-toggle");
  const linksContainer = document.getElementById("nav-links");
  if (!toggleButton || !linksContainer) return;

  const closeMenu = () => {
    linksContainer.classList.remove("open");
    toggleButton.setAttribute("aria-expanded", "false");
  };

  toggleButton.addEventListener("click", () => {
    const isOpen = linksContainer.classList.toggle("open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  linksContainer.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function initRevealVariants() {
  const revealItems = document.querySelectorAll(".reveal");
  const variants = ["reveal-slide", "reveal-scale", "reveal-tilt"];
  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    item.classList.remove("reveal-left", "reveal-right");
    item.classList.add(variants[index % variants.length]);
  });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initActiveSectionHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", active);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initSkillProgress() {
  const section = document.getElementById("skills");
  const bars = document.querySelectorAll(".progress-fill[data-progress]");
  const values = document.querySelectorAll(".skill-value[data-target]");
  if (!section || !bars.length) return;

  let started = false;

  const animateNumber = (element, target) => {
    const duration = 1020;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(eased * target)}%`;
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          bars.forEach((bar) => {
            const target = Number(bar.dataset.progress || 0);
            bar.style.width = `${target}%`;
          });
          values.forEach((value) => {
            const target = Number(value.dataset.target || 0);
            animateNumber(value, target);
          });
          obs.unobserve(section);
        }
      });
    },
    { threshold: 0.34 }
  );

  observer.observe(section);
}

function initCounters() {
  const section = document.getElementById("analytics");
  const counters = document.querySelectorAll(".counter[data-target]");
  if (!section || !counters.length) return;

  let started = false;

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1180;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(eased * target);
      element.textContent = `${value.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach(animateCounter);
          obs.unobserve(section);
        }
      });
    },
    { threshold: 0.36 }
  );

  observer.observe(section);
}

function initProjectTilt() {
  const cards = document.querySelectorAll(".tilt-card");
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (!cards.length || coarsePointer) return;

  cards.forEach((card) => {
    const clamp = 9;
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * clamp;
      const rotateY = ((x - centerX) / centerX) * clamp;
      card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    });
  });
}

function initHeroParticles() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  const maxDpr = 2;
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.7,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.24 + 0.14,
    tone: Math.random() > 0.55 ? "cyan" : "purple"
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    width = window.innerWidth;
    height = Math.max(window.innerHeight, 560);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const desiredCount = width < 740 ? 24 : 40;
    particles.length = 0;
    for (let index = 0; index < desiredCount; index += 1) {
      particles.push(createParticle());
    }
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;

      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 4
      );

      if (particle.tone === "cyan") {
        gradient.addColorStop(0, `rgba(34, 211, 238, ${particle.alpha})`);
        gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
      } else {
        gradient.addColorStop(0, `rgba(139, 92, 246, ${particle.alpha})`);
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    animationFrame = requestAnimationFrame(render);
  };

  resize();
  render();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
}

function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (!glow || coarsePointer) return;

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let frame = 0;

  const animate = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    frame = requestAnimationFrame(animate);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add("active");
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", () => {
    glow.classList.remove("active");
  });

  animate();
  window.addEventListener("beforeunload", () => cancelAnimationFrame(frame));
}

function initMagneticEffects() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (coarsePointer) return;

  const magneticTargets = document.querySelectorAll(".btn, .theme-toggle");
  if (!magneticTargets.length) return;

  magneticTargets.forEach((element) => {
    const strength = element.classList.contains("theme-toggle") ? 5 : 8;

    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (event.clientX - centerX) / rect.width;
      const deltaY = (event.clientY - centerY) / rect.height;
      element.style.setProperty("--mx", `${(deltaX * strength).toFixed(2)}px`);
      element.style.setProperty("--my", `${(deltaY * strength).toFixed(2)}px`);
    });

    element.addEventListener("mouseleave", () => {
      element.style.setProperty("--mx", "0px");
      element.style.setProperty("--my", "0px");
    });
  });
}

function setCurrentYear() {
  const element = document.getElementById("year");
  if (element) {
    element.textContent = String(new Date().getFullYear());
  }
}

