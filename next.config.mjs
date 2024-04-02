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
            destination: "/event/storm/2",
            permanent: true,
        },
        {
            source: "/campaign/29",
            destination: "/event/campaign/1",
            permanent: true,
        },
        {
            source: "/campaign/storm",
            destination: "/event/storm/2",
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
