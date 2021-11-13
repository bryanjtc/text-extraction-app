module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "firebasestorage.googleapis.com"],
  },
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
};
