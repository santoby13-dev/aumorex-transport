import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/quote.html", destination: "/quote", permanent: true },
      { source: "/legal.html", destination: "/legal", permanent: true },
      { source: "/de/index.html", destination: "/de", permanent: true },
      { source: "/de/portfolio.html", destination: "/de/portfolio", permanent: true },
      { source: "/de/quote.html", destination: "/de/quote", permanent: true },
    ];
  },
};

export default nextConfig;
