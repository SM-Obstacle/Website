import { getPublicApiUrl, type PublicEnv } from "@/lib/utils";

/**
 * Serves the public runtime configuration to the browser as `window.__ENV__`.
 *
 * It's read from the environment at request time (not inlined by `next build`
 * like `NEXT_PUBLIC_*` variables), so the same image can be deployed against any
 * API. The root layout loads it before hydration.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const env: PublicEnv = {
    RECORDS_API_URL: getPublicApiUrl(),
  };

  return new Response(`window.__ENV__ = ${JSON.stringify(env)};\n`, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
