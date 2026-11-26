import { networkInterfaces } from "node:os";

/**
 * Hosts other than localhost allowed to load the dev server's scripts. Next
 * blocks them otherwise, and a phone on the LAN opening http://<this
 * machine's IP>:3000 gets a page that renders but never hydrates.
 *
 * Defaults to this machine's own LAN addresses, so that just works wherever
 * the dev server runs. `ALLOWED_DEV_ORIGINS` (comma-separated) adds more, for
 * a hostname or a tunnel. Only the dev server reads this.
 */
function devOrigins() {
  const lan = Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === "IPv4" && !address.internal)
    .map((address) => address.address);

  const extra = (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...lan, ...extra])];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: devOrigins(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "obstacle.titlepack.io",
        port: "",
        pathname: "/data/**",
      },
    ],
  },
  output: "standalone",
  redirects: async () => [
    {
      source: "/storm",
      destination: "/event/storm_runners/2",
      permanent: true,
    },
    // TODO: move the redirects of /campaign to a new src/app/campaign/page.tsx file
    // which would fetch for the latest edition
    {
      source: "/campaign/29",
      destination: "/event/campaign/1",
      permanent: true,
    },
    {
      source: "/campaign/storm",
      destination: "/event/storm_runners/2",
      permanent: true,
    },
    {
      source: "/campaign/39",
      destination: "/event/benchmark/2",
      permanent: true,
    },
  ],
};

export default nextConfig;
