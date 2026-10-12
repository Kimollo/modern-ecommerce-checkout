import { useEffect } from 'react';

let locks = 0;

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    locks += 1;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = previous;
    };
  }, [locked]);
}
