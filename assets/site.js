(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Animate reveal-on-scroll only when motion is welcome; content is visible by default otherwise.
  const revealItems = [...document.querySelectorAll(".reveal")];
  if (!reduce.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Mark the current static page in the small navigation.
  const currentFile = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  document.querySelectorAll(".site-nav a[href]").forEach((link) => {
    const href = link.getAttribute("href").split(/[?#]/)[0];
    if (href === currentFile || (currentFile === "index.html" && href === "./")) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Keep the looping ticker accessible: its duplicated visual run is hidden from screen readers.
  document.querySelectorAll("[data-ticker-copy]").forEach((copy) => copy.setAttribute("aria-hidden", "true"));

  // Let visitors copy the verified quick-start commands without leaving the page.
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = "Copied";
        button.classList.add("is-copied");
        window.setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("is-copied");
        }, 1600);
      } catch {
        button.textContent = "Select manually";
        window.setTimeout(() => { button.textContent = "Copy"; }, 1800);
      }
    });
  });
})();
