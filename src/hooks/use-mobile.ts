import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function useIsMobile() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const mediaQueryList = window.matchMedia(QUERY);
      mediaQueryList.addEventListener("change", onStoreChange);

      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    getSnapshot,
    getServerSnapshot,
  );
}
