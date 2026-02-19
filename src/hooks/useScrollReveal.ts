import { useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to any element that should fade-in when it
 * scrolls into view.
 *
 * The element starts with `opacity: 0; transform: translateY(24px)` and
 * transitions to `opacity: 1; transform: translateY(0)` once at least
 * 15% of it is visible.
 *
 * Usage:
 * ```tsx
 * const ref = useScrollReveal<HTMLDivElement>();
 * return <div ref={ref}>content</div>;
 * ```
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply initial hidden styles
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el); // only animate once
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  return ref;
}
