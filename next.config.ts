import {setupDevPlatform} from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to
// use bindings during local development (when running the application with
// `next dev`). This function is only necessary during development and
// has no impact outside of that. For more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
setupDevPlatform().catch(console.error);

import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.cache = false;
    return config;
  },
    /* config options here */
    transpilePackages: [
        "rc-util",
        "rc-picker",
        "rc-tree",
        "rc-table"
    ],
    publicRuntimeConfig: {
        holesky: "0x0485363841220E83D478F2066f354BADAD1e8fcb",
        sepolia: "0x433Ae9e83B576E629C3686E44636d2F153A7A9Cb",
        network: "holesky.etherscan.io",
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://127.0.0.1:9000/api/:path*"
            },
        ];
    }
};

export default nextConfig;
