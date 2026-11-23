/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hosts other than localhost allowed to load the dev server's scripts, e.g.
  // a phone on the LAN opening http://192.168.1.x:3000. Without this the page
  // renders but never hydrates there. Comma-separated; dev only.
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
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
