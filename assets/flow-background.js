/*
 * Nocturne Flow — original procedural background animation.
 * Open, sweeping contours only: no closed loops, orbit paths, or particle orbs.
 * Dependency-free Canvas 2D; see README.md for integration and tuning.
 */
(() => {
  "use strict";

  const CONFIG = {
    maxDpr: 1.5,
    strands: 54,
    stepPx: 11,
    speed: 0.000095,
    amplitude: 0.105,
    opacity: 0.48,
    palette: [
      { at: 0.00, color: "#173f48" },
      { at: 0.28, color: "#237d83" },
      { at: 0.55, color: "#6572a4" },
      { at: 0.78, color: "#b25f91" },
      { at: 1.00, color: "#355a72" }
    ]
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  class FlowBackground {
    constructor(host) {
      this.host = host;
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("aria-hidden", "true");
      this.canvas.setAttribute("role", "presentation");
      this.ctx = this.canvas.getContext("2d", { alpha: true, desynchronized: true });
      this.host.appendChild(this.canvas);
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.raf = 0;
      this.running = false;
      this.userPaused = reduceMotion.matches;
      this.userOverride = false;
      this.startedAt = performance.now();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.host);
      this.onVisibility = () => this.refresh();
      document.addEventListener("visibilitychange", this.onVisibility);
      this.onMotionPreference = () => {
        if (!this.userOverride) this.userPaused = reduceMotion.matches;
        this.refresh();
      };
      if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener("change", this.onMotionPreference);
      } else if (reduceMotion.addListener) {
        reduceMotion.addListener(this.onMotionPreference);
      }
      this.resize();
      this.draw(0);
      this.refresh();
    }

    resize() {
      const rect = this.host.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.draw(this.running ? performance.now() - this.startedAt : 0);
    }

    refresh() {
      const shouldRun = !this.userPaused && !document.hidden;
      if (shouldRun && !this.running) {
        this.running = true;
        this.startedAt = performance.now();
        this.raf = requestAnimationFrame(this.frame);
      } else if (!shouldRun && this.running) {
        this.running = false;
        cancelAnimationFrame(this.raf);
        this.draw(performance.now() - this.startedAt);
      }
    }

    frame = (now) => {
      if (!this.running) return;
      this.draw(now - this.startedAt);
      this.raf = requestAnimationFrame(this.frame);
    };

    colorGradient() {
      const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height * 0.12);
      for (const stop of CONFIG.palette) gradient.addColorStop(stop.at, stop.color);
      return gradient;
    }

    draw(elapsed) {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      if (!ctx || !w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const time = elapsed * CONFIG.speed;
      const gradient = this.colorGradient();
      const shortSide = Math.min(w, h);
      const strandCount = Math.max(26, Math.min(72, Math.round(CONFIG.strands * Math.sqrt((w * h) / (1440 * 900)))));
      const amplitude = Math.min(112, shortSide * CONFIG.amplitude);
      const step = Math.max(8, Math.min(16, CONFIG.stepPx * (w < 640 ? 1.2 : 1)));
      const xStart = -w * 0.1;
      const xEnd = w * 1.1;
      const pointCount = Math.ceil((xEnd - xStart) / step);

      // Each stroke stays an open, gently broken contour. Offsets vary by band;
      // the field flows laterally so nothing circles a focal point or closes.
      for (let i = 0; i < strandCount; i++) {
        const band = (i + 0.5) / strandCount;
        const anchor = band * h;
        const phase = time * (0.72 + (i % 7) * 0.035) + i * 0.31;
        const slant = (band - 0.5) * w * 0.21;
        const amp = amplitude * (0.52 + 0.48 * Math.sin(Math.PI * band));

        ctx.beginPath();
        for (let j = 0; j <= pointCount; j++) {
          const x = xStart + j * step;
          const nx = x / Math.max(1, w);
          const broad = Math.sin(nx * 4.6 + phase + band * 2.1);
          const fine = Math.sin(nx * 10.2 - phase * 0.61 + i * 0.17);
          const bend = Math.sin(nx * 2.2 + phase * 0.37 + band * 5.4);
          const y = anchor + slant * nx + amp * (0.64 * broad + 0.23 * fine + 0.13 * bend);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const emphasis = 0.34 + 0.66 * Math.pow(Math.sin(Math.PI * band), 0.7);
        const opacity = CONFIG.opacity * emphasis;
        const width = 0.55 + (i % 9 === 0 ? 0.7 : 0) + (i % 17 === 0 ? 0.8 : 0);

        // Soft color undercurrent, then a fine etched filament.
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = opacity * 0.12;
        ctx.lineWidth = width * 12;
        ctx.stroke();
        ctx.globalAlpha = opacity * 0.27;
        ctx.lineWidth = width * 3.2;
        ctx.stroke();
        ctx.globalAlpha = opacity * 0.82;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
      }

      // A broad diagonal veil gives the lower edge a deep ink-blue falloff.
      const veil = ctx.createLinearGradient(0, h * 0.28, w, h);
      veil.addColorStop(0, "rgba(5, 12, 17, 0)");
      veil.addColorStop(0.58, "rgba(8, 12, 20, 0.05)");
      veil.addColorStop(1, "rgba(5, 7, 12, 0.34)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);
    }

    pause() {
      this.userPaused = true;
      this.userOverride = true;
      this.refresh();
    }

    resume() {
      this.userPaused = false;
      this.userOverride = true;
      this.refresh();
    }
  }

  const backgrounds = [...document.querySelectorAll("[data-flow-background]")]
    .map((host) => new FlowBackground(host));

  const toggle = document.querySelector("[data-flow-motion-toggle]");
  if (toggle && backgrounds.length) {
    const updateButton = () => {
      const paused = backgrounds.every((item) => item.userPaused);
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.textContent = paused ? "Play background motion" : "Pause background motion";
    };
    toggle.addEventListener("click", () => {
      const shouldPause = backgrounds.some((item) => !item.userPaused);
      backgrounds.forEach((item) => shouldPause ? item.pause() : item.resume());
      updateButton();
    });
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", updateButton);
    updateButton();
  }

  // Optional tiny public API for projects that control motion elsewhere.
  window.unlockedFlowBackground = Object.freeze({
    pause: () => backgrounds.forEach((item) => item.pause()),
    resume: () => backgrounds.forEach((item) => item.resume()),
    count: backgrounds.length
  });
})();
