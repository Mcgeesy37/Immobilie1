document.addEventListener("DOMContentLoaded", async () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const reveals = document.querySelectorAll(".reveal");
  const cursorGlow = document.getElementById("cursorGlow");
  const heroImage = document.querySelector(".hero-media img");
  const servicesGrid = document.getElementById("servicesGrid");
  const propertyGrid = document.getElementById("propertyGrid");
  const testimonialGrid = document.getElementById("testimonialGrid");

  function setHeaderState() {
    if (!header) return;
    if (window.scrollY > 18) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("reveal-visible"));
  }

  if (cursorGlow) {
    document.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    document.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      cursorGlow.style.opacity = "0.72";
    });
  }

  let ticking = false;

  function applyScrollEffects() {
    const y = window.scrollY || window.pageYOffset;

    if (heroImage && window.innerWidth > 860) {
      const offset = Math.min(y * 0.05, 30);
      heroImage.style.transform = `scale(1.04) translateY(${offset}px)`;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(applyScrollEffects);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  applyScrollEffects();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      const headerOffset = 76;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  document.querySelectorAll("[data-current-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  try {
    const response = await fetch("data.json");
    const data = await response.json();

    if (servicesGrid && Array.isArray(data.services)) {
      servicesGrid.innerHTML = data.services.map((item, index) => `
        <article class="service-card reveal">
          <span class="service-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `).join("");
    }

    if (propertyGrid && Array.isArray(data.properties)) {
      propertyGrid.innerHTML = data.properties.map((item, index) => `
        <article class="property-card ${index === 0 ? "property-large" : ""} reveal">
          <img src="${item.image}" alt="${item.alt}">
          <div class="property-overlay">
            <span>${item.tag}</span>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
        </article>
      `).join("");
    }

    if (testimonialGrid && Array.isArray(data.testimonials)) {
      testimonialGrid.innerHTML = data.testimonials.map(() => "").join("");
      testimonialGrid.innerHTML = data.testimonials.map((item) => `
        <article class="testimonial-card reveal">
          <p>„${item.text}“</p>
        </article>
      `).join("");
    }

    const newRevealItems = document.querySelectorAll(".service-card.reveal, .property-card.reveal, .testimonial-card.reveal");
    if ("IntersectionObserver" in window && newRevealItems.length) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
      });

      newRevealItems.forEach(el => observer.observe(el));
    } else {
      newRevealItems.forEach(el => el.classList.add("reveal-visible"));
    }
  } catch (error) {
    console.error("Fehler beim Laden von data.json:", error);
  }
});
