
    document.documentElement.classList.add("js");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#main-nav");

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Открыть меню" : "Закрыть меню");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Открыть меню");
    }));

    document.querySelector("#year").textContent = new Date().getFullYear();

    const items = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }), { threshold: .12 });
      items.forEach(item => observer.observe(item));
    } else {
      items.forEach(item => item.classList.add("is-visible"));
    }
