import { useCallback, useSyncExternalStore } from 'react';

export function useWindowWidth() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);
  return useSyncExternalStore(subscribe, () => window.innerWidth);
}
