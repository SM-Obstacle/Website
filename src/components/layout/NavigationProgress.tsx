"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Whether a page navigation is under way, and how far along it seems to be.
 *
 * The App Router has no navigation events, so a navigation is taken to start
 * when an internal link is clicked and to end once the URL the router renders
 * (`usePathname` + `useSearchParams`) changes. `progress` is simulated — the
 * server gives no real figure — and creeps towards 90% until the page lands.
 */
type NavigationState = { pending: boolean; progress: number };

const NavigationContext = createContext<NavigationState>({
  pending: false,
  progress: 0,
});

export const useNavigationProgress = () => useContext(NavigationContext);

/** Past this, a navigation that never landed (aborted, errored) is dropped. */
const GIVE_UP_MS = 30_000;
/** How long the full ring stays on screen once the page has landed. */
const FINISH_MS = 350;

function currentUrl() {
  return window.location.pathname + window.location.search;
}

/** Whether a click on this anchor is one the Next router will handle. */
function internalTarget(event: MouseEvent): URL | null {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  const anchor = (event.target as Element | null)?.closest?.("a");
  if (
    !anchor ||
    !anchor.href ||
    anchor.hasAttribute("download") ||
    (anchor.target && anchor.target !== "_self")
  ) {
    return null;
  }

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  // A hash-only jump, or a link to the page already shown.
  if (url.pathname + url.search === currentUrl()) return null;

  return url;
}

/** Reports every URL the router commits. Apart so `useSearchParams` can suspend. */
function UrlWatcher({ onChange }: { onChange: (url: string) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    onChange(url);
  }, [url, onChange]);

  return null;
}

export function NavigationProgressProvider({
  children,
}: React.PropsWithChildren) {
  const [state, setState] = useState<NavigationState>({
    pending: false,
    progress: 0,
  });
  const startedAt = useRef<number | null>(null);
  const timers = useRef<{ tick?: number; giveUp?: number; finish?: number }>(
    {},
  );

  const clearTimers = useCallback(() => {
    window.clearInterval(timers.current.tick);
    window.clearTimeout(timers.current.giveUp);
    window.clearTimeout(timers.current.finish);
  }, []);

  // Stable across renders, so `UrlWatcher`'s effect only fires on URL changes.
  const onUrlChange = useCallback(() => {
    if (startedAt.current === null) return;
    startedAt.current = null;
    clearTimers();
    setState({ pending: true, progress: 1 });
    timers.current.finish = window.setTimeout(
      // The ring stays full while it fades out; the next start empties it.
      () => setState({ pending: false, progress: 1 }),
      FINISH_MS,
    );
  }, [clearTimers]);

  useEffect(() => {
    const start = () => {
      clearTimers();
      startedAt.current = performance.now();
      // From empty, and without a transition (see `LoadingLogo`): the ring is
      // still fading in, so the jump back from the last navigation's full ring
      // isn't seen. The first tick then sweeps it forward.
      setState({ pending: true, progress: 0 });

      timers.current.tick = window.setInterval(() => {
        if (startedAt.current === null) return;
        const elapsed = performance.now() - startedAt.current;
        // Fast at first, then ever slower: 50% after ~1s, 80% after ~3.5s.
        setState({
          pending: true,
          progress: 0.08 + 0.82 * (1 - Math.exp(-elapsed / 1800)),
        });
      }, 150);

      timers.current.giveUp = window.setTimeout(() => {
        startedAt.current = null;
        clearTimers();
        setState({ pending: false, progress: 0 });
      }, GIVE_UP_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (internalTarget(event)) start();
    };

    // Capture phase: by the bubble phase Next's `<Link>` has already called
    // `preventDefault` (it takes the navigation over from the browser), and
    // `NoPropagationLink` stops the event before it gets back up here.
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <NavigationContext.Provider value={state}>
      <Suspense fallback={null}>
        <UrlWatcher onChange={onUrlChange} />
      </Suspense>
      {children}
    </NavigationContext.Provider>
  );
}
