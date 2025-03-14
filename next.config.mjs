/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "obstacle.titlepack.io",
                port: "",
                pathname: "/data/**",
            }
        ]
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
        }
    ]
};

export default nextConfig;
