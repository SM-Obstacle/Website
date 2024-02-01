import { ServerProps } from "@/lib/server-props";
import { getApiHost } from "@/lib/utils";

export default async function GiveTokenPage({
  searchParams,
}: ServerProps) {
  const res = await fetch(`${getApiHost()}/player/give_token`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(searchParams),
  });

  let err = null;
  if (!res.ok) {
    err = await res.json()
      .catch((_) => ({
        err: 105,
        message: "Error response not JSON",
      }));
  }

  let h2Detail = null;
  if (err?.type === 207) { // InvalidMPCode
    h2Detail = `It looks like you logged in with a different account than the one used in game.
Try to log out from the ManiaPlanet page, then retry with the correct account.`;
  }

  return (
    <div>
      {res.ok ? (
        <h1>You are all set! You can close this tab now.</h1>
      ) : (
        <>
          <h1>
            Something went wrong. Please contact the developers
            (i.e. @ahmadbky or @MiLTanT on discord).
          </h1>
          {h2Detail && <h2>{h2Detail}</h2>}
          <pre style={{ backgroundColor: "#333c" }}>
            State: {searchParams.state}
            {JSON.stringify(err)}
          </pre>
        </>
      )}
    </div>
  );
}