import { useEffect, useState } from 'react';

/**
 * Observes a list of section elements (by ID) and returns the ID of the one
 * currently most visible in the viewport.
 *
 * Uses IntersectionObserver with a rootMargin that accounts for the fixed
 * top-nav (60px) and triggers when a section enters the top 40% of the viewport.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the top of the viewport that is intersecting
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Offset for top nav; trigger in the top portion of viewport
        rootMargin: '-80px 0px -55% 0px',
        threshold: 0,
      },
    );

    const elements: Element[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [sectionIds.join(',')]); // re-run when the list of IDs changes

  return activeId;
}
