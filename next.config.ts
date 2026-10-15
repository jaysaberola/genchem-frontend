import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{ source: "/public/home", destination: "/", permanent: false },
			{ source: "/public/about-us", destination: "/about-us", permanent: false },
			{ source: "/public/contact-us", destination: "/contact-us", permanent: false },
			{ source: "/public/products", destination: "/products", permanent: false },
		];
	},
	async rewrites() {
		return {
			afterFiles: [
				{ source: "/:slug", destination: "/public/:slug" },
				{ source: "/product/:slug", destination: "/public/product/:slug" },
			],
		};
	},
	devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,          // check for changes every 1s
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
