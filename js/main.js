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
/* ---------------------------- contact form -------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submitBtn = document.querySelector("#submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Fill in every field before sending.";
      status.classList.remove("ok");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.textContent = "";

    try {
      const response = await fetch("https://formspree.io/f/xoeadona", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (response.ok) {
        status.textContent = `Thanks, ${name.split(" ")[0]}. Your message reached me — I'll reply within 24 hours.`;
        status.classList.add("ok");
        form.reset();
      } else {
        const data = await response.json();
        status.textContent = data.errors
          ? data.errors.map((err) => err.message).join(", ")
          : "Something went wrong. Please email me directly.";
        status.classList.remove("ok");
      }
    } catch (err) {
      status.textContent = "Network error — please try again or email me directly.";
      status.classList.remove("ok");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
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

/* ---------------------------- scroll top button -------------------------- */
function initScrollTop() {
  const btn = document.querySelector(".scroll-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------- theme toggle ------------------------------- */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  if (!toggleBtns.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  });
}

