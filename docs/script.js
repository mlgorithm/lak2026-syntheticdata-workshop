(function () {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"], .footer-links a[href^="#"], .brand[href^="#"], .hero-actions a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const animatedItems = document.querySelectorAll(".feature-card, .resource-card, .organizer-card, .timeline-item, .contact-panel");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function closeMenu() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            document.querySelectorAll(".nav-menu a").forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    animatedItems.forEach(function (item) {
      item.setAttribute("data-animate", "");
      revealObserver.observe(item);
    });
  }

  const canvas = document.querySelector("[data-hero-canvas]");
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let points = [];
  let animationFrame = null;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(30, Math.floor((width * height) / 24000));
    points = Array.from({ length: count }, function (_, index) {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: 1.4 + (index % 4) * 0.45,
        color: index % 5 === 0 ? "rgba(247, 189, 104, 0.86)" : "rgba(132, 211, 197, 0.72)"
      };
    });
  }

  function drawDataField() {
    context.clearRect(0, 0, width, height);

    const grid = 44;
    context.lineWidth = 1;
    context.strokeStyle = "rgba(255, 255, 255, 0.045)";
    for (let x = 0; x < width; x += grid) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += grid) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 150) {
          context.strokeStyle = "rgba(132, 211, 197, " + (0.13 * (1 - distance / 150)).toFixed(3) + ")";
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    points.forEach(function (point) {
      context.fillStyle = point.color;
      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  function animateDataField() {
    points.forEach(function (point) {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -10) point.x = width + 10;
      if (point.x > width + 10) point.x = -10;
      if (point.y < -10) point.y = height + 10;
      if (point.y > height + 10) point.y = -10;
    });

    drawDataField();
    animationFrame = window.requestAnimationFrame(animateDataField);
  }

  resizeCanvas();
  drawDataField();

  if (!reduceMotion) {
    animationFrame = window.requestAnimationFrame(animateDataField);
  }

  window.addEventListener("resize", function () {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    resizeCanvas();
    drawDataField();
    if (!reduceMotion) {
      animationFrame = window.requestAnimationFrame(animateDataField);
    }
  });
})();
