import type { InMemoryCacheConfig } from "@apollo/client";

/**
 * Cache policies shared by the server and browser clients, so the two can't
 * drift. Each builds its own `InMemoryCache` — the browser needs the subclass
 * from `@apollo/client-integration-nextjs` to hydrate what the server sent.
 *
 * `EventEdition.id` is only unique inside its own event — campaign, benchmark
 * and storm_runners all have an edition 2. Normalising on it merges them into
 * a single `EventEdition:2` entry, so every event renders whichever one was
 * written first. Editions are always read through their parent event, so there
 * is nothing to gain from normalising them: keep them inline.
 */
export const typePolicies: InMemoryCacheConfig["typePolicies"] = {
  EventEdition: { keyFields: false },
};
