import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                port: "",
                pathname: "/a/zzhaqm5h82/**",
            },
        ],
		dangerouslyAllowSVG: true, // Enable SVG handling
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Add CSP for extra safety	
    },
};

export default nextConfig;
