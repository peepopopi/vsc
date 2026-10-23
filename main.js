
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

    const compactNav = window.matchMedia("(max-width: 1250px) and (min-width: 921px)");
    const textRects = element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return [...range.getClientRects()];
    };
    const positionNavDividers = () => {
      const allItems = [...nav.querySelectorAll("li")];
      const visibleItems = allItems.filter(item =>
        getComputedStyle(item).display !== "none" && item.getBoundingClientRect().width > 0
      );

      allItems.forEach(item => {
        item.style.removeProperty("left");
        item.style.removeProperty("position");
        item.style.removeProperty("--nav-divider-left");
      });

      if (compactNav.matches) {
        const labelBounds = visibleItems.map(item => {
          const rects = textRects(item.querySelector("a"));
          return {
            left: Math.min(...rects.map(rect => rect.left)),
            right: Math.max(...rects.map(rect => rect.right)),
            lines: rects.length
          };
        });
        const hasWrappedLabel = labelBounds.some(bounds => bounds.lines > 1);

        if (hasWrappedLabel && visibleItems.length > 1) {
          const textWidth = labelBounds.reduce((sum, bounds) => sum + bounds.right - bounds.left, 0);
          const equalGap = (labelBounds[labelBounds.length - 1].right - labelBounds[0].left - textWidth) / (visibleItems.length - 1);
          let targetLeft = labelBounds[0].left;
          visibleItems.forEach((item, index) => {
            const bounds = labelBounds[index];
            item.style.position = "relative";
            item.style.left = `${targetLeft - bounds.left}px`;
            targetLeft += bounds.right - bounds.left + equalGap;
          });
        }
      }

      visibleItems.forEach((item, index) => {
        if (!compactNav.matches || index === visibleItems.length - 1) {
          item.style.removeProperty("--nav-divider-left");
          return;
        }

        const link = item.querySelector("a");
        const nextLink = visibleItems[index + 1].querySelector("a");
        const linkRects = textRects(link);
        const nextRects = textRects(nextLink);
        const currentBounds = {
          left: Math.min(...linkRects.map(rect => rect.left)),
          right: Math.max(...linkRects.map(rect => rect.right))
        };
        const nextBounds = {
          left: Math.min(...nextRects.map(rect => rect.left)),
          right: Math.max(...nextRects.map(rect => rect.right))
        };
        const dividerCenter = (currentBounds.right + nextBounds.left) / 2;
        const linkLeft = link.getBoundingClientRect().left;
        item.style.setProperty("--nav-divider-left", `${dividerCenter - linkLeft - 1}px`);
      });
    };
    let dividerFrame;
    const scheduleDividerPosition = () => {
      cancelAnimationFrame(dividerFrame);
      dividerFrame = requestAnimationFrame(positionNavDividers);
    };
    window.addEventListener("resize", scheduleDividerPosition);
    new ResizeObserver(scheduleDividerPosition).observe(nav);
    document.fonts.ready.then(scheduleDividerPosition);
    positionNavDividers();

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
