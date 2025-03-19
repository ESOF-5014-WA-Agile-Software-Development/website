import {setupDevPlatform} from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to
// use bindings during local development (when running the application with
// `next dev`). This function is only necessary during development and
// has no impact outside of that. For more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
setupDevPlatform().catch(console.error);

import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    transpilePackages: [
        "rc-util",
        "rc-picker",
        "rc-tree",
        "rc-table"
    ],
    publicRuntimeConfig: {
        holesky: "0xD0cf3531b1c2Ef02d6fecC5a46B187d88f06689D",
        sepolia: "0x433Ae9e83B576E629C3686E44636d2F153A7A9Cb",
        network: "holesky.etherscan.io",
    }
};

export default nextConfig;
