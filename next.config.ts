import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	images: {
		formats: ["image/avif", "image/webp"],
		qualities: [75, 85],
		minimumCacheTTL: 2678400, // 31 days
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default withNextIntl(nextConfig);
