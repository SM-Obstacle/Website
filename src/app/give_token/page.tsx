import type { ServerProps } from "@/lib/server-props";
import { getApiHost } from "@/lib/utils";

const INVALID_MP_CODE_TYPE = 207;

export default async function GiveTokenPage({ searchParams }: ServerProps) {
  const res = await fetch(`${getApiHost()}/player/give_token`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(searchParams),
  });

  const err =
    !res.ok &&
    (await res.json().catch((_) => ({
      type: 105,
      message: "Error response not JSON",
    })));

  return (
    <div>
      {res.ok ? (
        <h1>You are all set! You can close this tab now.</h1>
      ) : (
        <>
          <h1>
            Something went wrong. Please contact the developers (i.e. @ahmadbky
            or @MiLTanT on discord).
          </h1>
          {err?.type === INVALID_MP_CODE_TYPE && (
            <h2>
              It looks like you logged in with a different account than the one
              used in game. Try to log out from the ManiaPlanet page, then retry
              with the correct account.
            </h2>
          )}
          <ul>
            <li>
              State: <code>{(await searchParams).state}</code>
            </li>
            <li>
              Response: <code>{JSON.stringify(err)}</code>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
