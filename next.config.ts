import type { NextConfig } from "next";

function cmsApiProxyTarget(): string | null {
  let base = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
  base = base.replace(/\/public$/i, "");
  return base || null;
}

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/public/images/genchemph/:path*",
				destination: "/images/genchemph/:path*",
				permanent: true,
			},
			{ source: "/public/home", destination: "/", permanent: false },
			{ source: "/public/about-us", destination: "/about-us", permanent: false },
			{ source: "/public/contact-us", destination: "/contact-us", permanent: false },
			{ source: "/public/products", destination: "/products", permanent: false },
			{ source: "/public/news", destination: "/news", permanent: false },
			{ source: "/public/news/:slug", destination: "/news/:slug", permanent: false },
			{ source: "/public/products/pvc-resins", destination: "/products#pvc-resins", permanent: true },
			{ source: "/public/products/pvc-stabilizers", destination: "/products#pvc-stabilizers", permanent: true },
			{ source: "/public/products/tab-1", destination: "/products#pvc-resins", permanent: true },
			{ source: "/public/products/tab-2", destination: "/products#pvc-stabilizers", permanent: true },
			{ source: "/products/pvc-resins", destination: "/products#pvc-resins", permanent: true },
			{ source: "/products/pvc-stabilizers", destination: "/products#pvc-stabilizers", permanent: true },
			{ source: "/products/tab-1", destination: "/products#pvc-resins", permanent: true },
			{ source: "/products/tab-2", destination: "/products#pvc-stabilizers", permanent: true },
		];
	},
	async rewrites() {
		const apiOrigin = cmsApiProxyTarget();
		const cmsApiRewrites = apiOrigin
			? [{ source: "/cms-api/:path*", destination: `${apiOrigin}/api/:path*` }]
			: [];
		const cmsUploadRewrites = apiOrigin
			? [
					{
						source: "/public/file-manager/:path*",
						destination: `${apiOrigin}/file-manager/:path*`,
					},
					{ source: "/file-manager/:path*", destination: `${apiOrigin}/file-manager/:path*` },
					{ source: "/storage/:path*", destination: `${apiOrigin}/storage/:path*` },
				]
			: [];

		return {
			// Public news listing at `/news` (must run before `pages/news/index.tsx`).
			beforeFiles: [{ source: "/news", destination: "/public/news" }],
			afterFiles: [
				...cmsApiRewrites,
				...cmsUploadRewrites,
				{ source: "/news/:slug", destination: "/public/news/:slug" },
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
