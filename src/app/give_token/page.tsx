import { getApiHost } from "@/lib/utils";

const INVALID_MP_CODE_TYPE = 207;

export default async function GiveTokenPage(
  props: PageProps<"/give_token">,
) {
  const searchParams = await props.searchParams;

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
    (await res.json().catch(() => ({
      type: 105,
      message: "Error response not JSON",
    })));

  return (
    <div className="m-auto max-w-2xl p-8">
      {res.ok ? (
        <h1 className="text-2xl font-bold">
          You are all set! You can close this tab now.
        </h1>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            Something went wrong. Please contact the developers (i.e. @ahmadbky
            or @MiLTanT on discord).
          </h1>
          {err?.type === INVALID_MP_CODE_TYPE && (
            <h2 className="mt-4 text-lg">
              It looks like you logged in with a different account than the one
              used in game. Try to log out from the ManiaPlanet page, then retry
              with the correct account.
            </h2>
          )}
          <ul className="mt-4 list-disc ps-6">
            <li>
              State: <code>{searchParams.state}</code>
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
