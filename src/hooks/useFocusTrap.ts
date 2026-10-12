import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.tabIndex !== -1 && element.getClientRects().length > 0,
  );
}

export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  containerRef: RefObject<T | null>,
  restoreFocus = true,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusableElements(container);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !items.includes(current as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (restoreFocus) previouslyFocused?.focus();
    };
  }, [active, containerRef, restoreFocus]);
}
