/* ==========================================================================
   shuraim.dev — main.js
   Vanilla JS only. Handles: sticky nav state, mobile menu, scroll reveal,
   hero terminal typing effect, and the contact form's client-side response.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initRevealOnScroll();
  initTerminalTyper();
  initContactForm();
  initCardMouseGlow();
  initStaggeredCards();
  initScrollTop();
  initThemeToggle();
});

/* ---------------------------- sticky nav + mobile menu ------------------ */
function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/* ---------------------------- reveal-on-scroll --------------------------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------- hero terminal line ------------------------- */
function initTerminalTyper() {
  const el = document.querySelector("[data-typer]");
  if (!el) return;

  const lines = JSON.parse(el.getAttribute("data-typer"));
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const textNode = el.querySelector(".typer-text");
  if (!textNode) return;

  function tick() {
    const current = lines[lineIndex];

    if (!deleting) {
      textNode.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = false;
        setTimeout(() => { deleting = true; tick(); }, 1400);
        return;
      }
    } else {
      textNode.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 42);
  }

  tick();
}

/* ---------------------------- contact form -------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Fill in every field before sending.";
      status.classList.remove("ok");
      return;
    }

    const subject = encodeURIComponent("New Message from Portfolio Contact Form");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:shuraimasif@email.com?subject=${subject}&body=${body}`;

    status.textContent = `Thanks, ${name.split(" ")[0]}. Opening your email client...`;
    status.classList.add("ok");
    form.reset();
  });
}

/* ---------------------------- card mouse-glow tracking ------------------- */
function initCardMouseGlow() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });
}

/* ---------------------------- staggered card reveal ---------------------- */
function initStaggeredCards() {
  const cards = document.querySelectorAll(".project-grid .project-card");
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
}


/* ---------------------------- theme toggle ------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

