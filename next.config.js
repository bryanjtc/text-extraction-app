module.exports = {
  output: 'export',
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "firebasestorage.googleapis.com"],
    loader: 'cloudinary',
    path: '',
  },
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
};
