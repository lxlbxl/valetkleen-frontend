"use client";

/**
 * Style D motion, ported from the mockups' scroll script. It is driven by data attributes so pages
 * stay server components:
 *   data-stg          stagger-reveal the element's children
 *   data-rv           reveal on enter
 *   data-par="-50"    vertical parallax (px across one viewport)
 *   data-clip="10"    clip-path reveal with image zoom
 *   data-drift="460"  horizontal drift (photo mosaic)
 *   data-story        pinned step story: children [data-step], [data-shot], [data-count]
 *   data-words        scroll-lit text; children must be <span class="wd"> (see <Words>)
 * Everything is skipped when the user prefers reduced motion.
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const $ = <T extends Element>(s: string) => Array.from(document.querySelectorAll<T & HTMLElement>(s));

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    $("[data-stg]").forEach((p) =>
      Array.from(p.children).forEach((c, i) => {
        (c as HTMLElement).style.setProperty("--i", String(i));
        c.setAttribute("data-rv", "");
      }),
    );
    $("[data-rv], .rv").forEach((e) => (reduce ? e.classList.add("in") : io.observe(e)));

    if (reduce) {
      $("[data-words] .wd").forEach((w) => w.classList.add("lit"));
      return () => io.disconnect();
    }

    const par = $("[data-par]");
    const clips = $("[data-clip]");
    const drift = $("[data-drift]");
    const story = $("[data-story]");
    const words = $("[data-words]").map((w) => ({ el: w, ws: Array.from(w.querySelectorAll(".wd")) }));

    let raf = 0;
    const frame = () => {
      const h = innerHeight;
      par.forEach((e) => {
        const r = e.getBoundingClientRect();
        const p = (r.top + r.height / 2 - h / 2) / h;
        e.style.transform = `translate3d(0,${(p * Number(e.dataset.par)).toFixed(1)}px,0)`;
      });
      clips.forEach((e) => {
        const r = e.getBoundingClientRect();
        const p = clamp((h - r.top) / (h * 0.85), 0, 1);
        const a = (1 - p) * (Number(e.dataset.clip) || 14);
        e.style.clipPath = `inset(${(a * 0.6).toFixed(2)}% ${a.toFixed(2)}% round ${e.dataset.r ?? 28}px)`;
        const img = e.querySelector("img");
        if (img) img.style.transform = `scale(${(1.18 - p * 0.18).toFixed(4)})`;
      });
      drift.forEach((e) => {
        const r = e.getBoundingClientRect();
        const p = (h - r.top) / (h + r.height);
        e.style.transform = `translate3d(${((p - 0.5) * Number(e.dataset.drift)).toFixed(1)}px,0,0)`;
      });
      story.forEach((s) => {
        const r = s.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - h), 0, 1);
        const steps = s.querySelectorAll("[data-step]");
        const shots = s.querySelectorAll("[data-shot]");
        const caps = s.querySelectorAll<HTMLElement>("[data-cap]");
        const k = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
        s.style.setProperty("--p", p.toFixed(4));
        steps.forEach((x, i) => x.classList.toggle("on", i === k));
        shots.forEach((x, i) => x.classList.toggle("on", i === k));
        caps.forEach((x, i) => (x.style.opacity = i === k ? "1" : "0"));
        const c = s.querySelector("[data-count]");
        if (c) c.textContent = String(k + 1).padStart(2, "0");
      });
      words.forEach(({ el, ws }) => {
        const r = el.getBoundingClientRect();
        const p = clamp((h * 0.85 - r.top) / (r.height + h * 0.35), 0, 1);
        const n = Math.round(p * ws.length);
        ws.forEach((x, i) => x.classList.toggle("lit", i < n));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
