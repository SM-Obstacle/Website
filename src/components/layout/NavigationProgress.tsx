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
 * when an internal link is clicked, or on Back/Forward, and to end once the
 * URL the router renders (`usePathname` + `useSearchParams`) changes. `progress` is simulated — the
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
/**
 * How long Back/Forward waits before showing anything. Next usually restores
 * those pages from its cache within a frame or two, and only fetches them when
 * that's gone (after a reload, say), so the logo shouldn't flicker for the
 * instant ones.
 */
const HISTORY_DELAY_MS = 150;

function currentUrl() {
  return window.location.pathname + window.location.search;
}

/**
 * One spelling for a URL, whether it comes from the router or from `location`:
 * the router hands the path back decoded and the query re-encoded.
 */
function urlKey(pathname: string, search: string) {
  let path = pathname;
  try {
    path = decodeURI(pathname);
  } catch {}
  const query = new URLSearchParams(search).toString();
  return query ? `${path}?${query}` : path;
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
  const url = urlKey(pathname, searchParams.toString());

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
  /** Whether the current navigation has been put on screen yet. */
  const shown = useRef(false);
  /** The URL the router last rendered, as `urlKey` spells it. */
  const renderedUrl = useRef<string | null>(null);
  const timers = useRef<{
    reveal?: number;
    tick?: number;
    giveUp?: number;
    finish?: number;
  }>({});

  const clearTimers = useCallback(() => {
    window.clearTimeout(timers.current.reveal);
    window.clearInterval(timers.current.tick);
    window.clearTimeout(timers.current.giveUp);
    window.clearTimeout(timers.current.finish);
  }, []);

  // Stable across renders, so `UrlWatcher`'s effect only fires on URL changes.
  const onUrlChange = useCallback((url: string) => {
    renderedUrl.current = url;
    if (startedAt.current === null) return;
    startedAt.current = null;
    clearTimers();
    // Landed before it was ever shown: nothing to finish.
    if (!shown.current) return;
    setState({ pending: true, progress: 1 });
    timers.current.finish = window.setTimeout(
      // The ring stays full while it fades out; the next start empties it.
      () => setState({ pending: false, progress: 1 }),
      FINISH_MS,
    );
  }, [clearTimers]);

  useEffect(() => {
    const start = (delay = 0) => {
      clearTimers();
      startedAt.current = performance.now();
      shown.current = false;

      const reveal = () => {
        shown.current = true;
        // From empty, and without a transition (see `LoadingLogo`): the ring
        // is still fading in, so the jump back from the last navigation's
        // full ring isn't seen. The first tick then sweeps it forward.
        setState({ pending: true, progress: 0 });
      };
      if (delay > 0) {
        timers.current.reveal = window.setTimeout(reveal, delay);
      } else {
        reveal();
      }

      timers.current.tick = window.setInterval(() => {
        if (startedAt.current === null || !shown.current) return;
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

    // Back/Forward. By now `location` already holds the entry being restored,
    // so it's compared with what the router last rendered: equal means a
    // hash-only change, or a page the router has already put up.
    const onPopState = () => {
      const target = urlKey(window.location.pathname, window.location.search);
      if (target !== renderedUrl.current) start(HISTORY_DELAY_MS);
    };

    // Capture phase: by the bubble phase Next's `<Link>` has already called
    // `preventDefault` (it takes the navigation over from the browser), and
    // `NoPropagationLink` stops the event before it gets back up here.
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", onPopState);
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
