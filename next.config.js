/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  publicRuntimeConfig: {
    site: {
      name: "Armin Van Buuren",
      url:
        process.env.NODE_ENV === "development"
          ? "https://arminvanbuurenapp.netlify.app"
          : "https://arminvanbuuren.io",
      title: "Armin Van Buuren Music",
      description:
        "",
      socialPreview: "/images/preview.jpg",
    },
  },
  images: {
    domains: [
      "arminvanbuurenapp.netlify.app",
      "arminvanbuuren.io",
      "www.arminvanbuuren.io",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
