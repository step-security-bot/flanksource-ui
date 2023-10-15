/**
 * @type {import('next').NextConfig}
 */
const config = {
  productionBrowserSourceMaps: true,
  async rewrites() {
    // if clerk is enabled, we will use next API routes to proxy requests to
    // the backend
    if (process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true") {
      return [];
    }

    // Read at build time. See Dockerfile for deployment related steps.
    const backendURL = process.env.BACKEND_URL || "http://localhost:3000/";
    const isCanary =
      process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
    const canaryPrefix = isCanary ? "" : "/canary";
    const LOCALHOST_ENV_URL_REWRITES = [
      {
        source: "/api/:path*",
        destination: `${backendURL}/api/:path*`
      }
    ];

    const URL_REWRITES = [
      {
        source: "/api/canary/:path*",
        destination: `${backendURL}/${canaryPrefix}/:path*`
      },
      {
        source: "/api/.ory/:path*",
        destination: `${backendURL}/kratos/:path*`
      },
      // All other API requests are proxied to the backend on the same path
      // as the request.
      {
        source: "/api/:path*",
        destination: `${backendURL}/:path*`
      }
    ];
    const rewrites = ["localhost", "netlify"].includes(process.env.ENV)
      ? LOCALHOST_ENV_URL_REWRITES
      : URL_REWRITES;

    return rewrites;
  },
  // https://github.com/vercel/next.js/tree/canary/examples/with-docker#in-existing-projects
  ...(process.env.NEXT_STANDALONE_DEPLOYMENT === "true"
    ? {
        output: "standalone"
      }
    : {}),
  experimental: {
    // increase the default timeout for the proxy from 30s to 10m to allow for
    // long running requests to the backend
    proxyTimeout: 1000 * 60 * 10
  },
  transpilePackages: ["monaco-editor"]
};

module.exports = config;
