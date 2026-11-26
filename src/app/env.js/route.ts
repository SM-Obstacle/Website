import type { NextRequest } from "next/server";

import { getPublicApiUrl, type PublicEnv } from "@/lib/utils";

/**
 * Serves the public runtime configuration to the browser as `window.__ENV__`.
 *
 * It's read from the environment at request time (not inlined by `next build`
 * like `NEXT_PUBLIC_*` variables), so the same image can be deployed against any
 * API. The root layout loads it before hydration.
 */
export const dynamic = "force-dynamic";

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * In development, an API on this machine's loopback address is pointed at the
 * host the page was opened from instead. A phone on the LAN opening
 * http://<this machine's IP>:3000 would otherwise send its API calls to
 * `localhost`, which for the phone is itself. The port and path are kept.
 */
function reachableFrom(apiUrl: string, request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return apiUrl;

  // From the `Host` header: `request.nextUrl` is built from the dev server's
  // own hostname and reads `localhost` whatever address the page was opened at.
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return apiUrl;

  const api = new URL(apiUrl);
  const pageHost = new URL(`http://${host}`).hostname;
  if (!LOOPBACK.has(api.hostname) || LOOPBACK.has(pageHost)) return apiUrl;

  api.hostname = pageHost;
  return api.toString().replace(/\/+$/, "");
}

export function GET(request: NextRequest) {
  const env: PublicEnv = {
    RECORDS_API_URL: reachableFrom(getPublicApiUrl(), request),
  };

  return new Response(`window.__ENV__ = ${JSON.stringify(env)};\n`, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      // In development the answer depends on the host asking (see
      // `reachableFrom`), so a copy cached before that changed must not linger.
      "Cache-Control":
        process.env.NODE_ENV === "development"
          ? "no-store"
          : "public, max-age=300",
    },
  });
}
