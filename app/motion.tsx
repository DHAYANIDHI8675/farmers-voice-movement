"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motion for this site is applied from one place rather than sprinkled
 * through the markup. Elements are found by selector, tagged, and revealed
 * as they enter the viewport.
 *
 * Two deliberate rules:
 *  - The hidden state is scoped to `.motion-ready`, a class added only after
 *    this code runs. If the script never runs, every element stays visible.
 *  - Nothing here changes meaning, position or order. Motion is a layer on
 *    top of a page that already works without it.
 */

export const BUILD = "2026-08-17-motion-4";

type Group = { selector: string; stagger?: number; variant?: "up" | "left" | "right" | "scale" };

const GROUPS: Group[] = [
  { selector: ".section-heading > div", variant: "left" },
  { selector: ".section-heading > p", variant: "right" },
  { selector: ".evidence-heading > div", variant: "up" },
  { selector: ".hero-ledger > div", stagger: 90 },
  { selector: ".home-docs > *", stagger: 110 },
  { selector: ".like-bar > *", stagger: 130, variant: "up" },
  { selector: ".impact-chain > div", stagger: 70, variant: "scale" },
  { selector: ".problem-grid article", stagger: 100 },
  { selector: ".poster-frame", variant: "left" },
  { selector: ".poster-story blockquote", variant: "right" },
  { selector: ".season-step", stagger: 90 },
  { selector: ".context-doc", stagger: 100 },
  { selector: ".demand-grid article", stagger: 85 },
  { selector: ".compare-cartoons figure", stagger: 140, variant: "scale" },
  { selector: ".comparison-row", stagger: 50, variant: "left" },
  { selector: ".compare-note", variant: "scale" },
  { selector: ".ninety-days", variant: "up" },
  { selector: ".timeline-steps article", stagger: 70, variant: "left" },
  { selector: ".role-panel", variant: "scale" },
  { selector: ".vote-box", variant: "scale" },
  { selector: ".testimony-block", variant: "up" },
  { selector: ".library-card", stagger: 90 },
  { selector: ".fact-check-note", variant: "up" },
  { selector: ".solution-hero > *", stagger: 140 },
  { selector: ".solution-grid article", stagger: 85 },
  { selector: ".value-slice > *", stagger: 150 },
  { selector: ".closing-call > *", stagger: 130 },
  { selector: ".myth-grid article", stagger: 90 },
  { selector: ".glossary-grid article", stagger: 55, variant: "scale" },
  { selector: ".faq-item", stagger: 65, variant: "up" },
  { selector: ".kit-grid article", stagger: 100 },
  { selector: ".kit-heading > *", stagger: 130 },
];

/* Numbers that should count up the first time they are seen. */
const COUNTER_SELECTOR = ".hero-ledger strong, .evidence-counts strong";

function animateNumber(el: HTMLElement) {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return;

  const original = node.nodeValue ?? "";
  const match = original.match(/^(\D*?)([\d,]+)([\s\S]*)$/);
  if (!match) return;

  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target) || target === 0) return;

  const format = new Intl.NumberFormat("en-IN");
  const duration = 1500;
  const start = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    // Ease-out cubic: fast first, settling gently on the real figure.
    const eased = 1 - Math.pow(1 - progress, 3);
    // Writing nodeValue keeps the original text node alive, so React can
    // still update this text later (for example on a language switch).
    node.nodeValue = `${prefix}${format.format(Math.round(target * eased))}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  node.nodeValue = `${prefix}0${suffix}`;
  requestAnimationFrame(step);
}

export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("motion-ready");
    if (reduced) {
      const stamp = document.querySelector(".build-stamp");
      if (stamp) stamp.textContent = `Build ${BUILD} · motion OFF (your device asks for reduced motion)`;
      return;
    }

    const cleanups: (() => void)[] = [];

    /* --- Reveal on scroll --- */
    /* Elements stay observed rather than being released after the first
       pass, so scrolling back up and down replays the animation. The
       asymmetric rootMargin matters: an element is revealed as soon as it
       enters from either edge, but only reset once it is well clear of the
       viewport, which stops anything flickering at the boundary. */
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { rootMargin: "-4% 0px -8% 0px", threshold: 0 }
    );

    GROUPS.forEach(({ selector, stagger = 0, variant = "up" }) => {
      const seen = new Map<Element, number>();
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el.classList.contains("reveal")) return;
        const parent = el.parentElement ?? document.body;
        const index = seen.get(parent) ?? 0;
        seen.set(parent, index + 1);

        el.classList.add("reveal", `reveal-${variant}`);
        if (stagger) el.style.transitionDelay = `${Math.min(index * stagger, 620)}ms`;
        revealObserver.observe(el);
      });
    });
    cleanups.push(() => revealObserver.disconnect());

    /* --- Count up the key figures --- */
    /* Counters re-run too, but only after the element has fully left the
       viewport and returned — otherwise a small scroll nudge would restart
       the count halfway through. */
    const counted = new WeakSet<Element>();
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (counted.has(entry.target)) return;
            counted.add(entry.target);
            animateNumber(entry.target as HTMLElement);
          } else if (entry.intersectionRatio === 0) {
            counted.delete(entry.target);
          }
        });
      },
      { threshold: [0, 0.6] }
    );
    document.querySelectorAll<HTMLElement>(COUNTER_SELECTOR).forEach((el) => counterObserver.observe(el));
    cleanups.push(() => counterObserver.disconnect());

    /* --- Hero artwork drifts against the scroll --- */
    const emblem = document.querySelector<HTMLElement>(".hero-emblem");
    let parallaxFrame = 0;
    const parallax = () => {
      parallaxFrame = 0;
      const y = window.scrollY;
      if (emblem && y < 1400) emblem.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
    };
    const onParallax = () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(parallax);
    };
    parallax();
    window.addEventListener("scroll", onParallax, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onParallax);
      cancelAnimationFrame(parallaxFrame);
    });

    /* --- Header condenses once the hero is behind you --- */
    const header = document.querySelector(".site-header");
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        header?.classList.toggle("is-condensed", window.scrollY > 140);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    });

    /* --- Highlight the section you are currently reading --- */
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".site-header nav a"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href") ?? ""))
      .filter((el): el is Element => Boolean(el));

    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
        links.forEach((link) => link.classList.toggle("is-current", link.getAttribute("href") === `#${top.target.id}`));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((section) => navObserver.observe(section));
    cleanups.push(() => navObserver.disconnect());

    /* A readout so it is always obvious which build is running and whether
       the motion layer actually engaged. Shown in the footer. */
    const stamp = document.querySelector(".build-stamp");
    if (stamp) {
      stamp.textContent =
        `Build ${BUILD} · motion ON · ${document.querySelectorAll(".reveal").length} animated blocks`;
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

/* A thin bar showing how far through the page you are. */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={ref} />
    </div>
  );
}

export function BackToTop({ label }: { label: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setShown(window.scrollY > 900);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      className={shown ? "back-to-top is-shown" : "back-to-top"}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={label}
      tabIndex={shown ? 0 : -1}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
