import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@nextplate/api",
    "@nextplate/rpc",
    "@repo/eslint-config",
    "@repo/typescript-config",
    "@repo/database"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "donext.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*"
      }
    ];
  }
};

export default nextConfig;
