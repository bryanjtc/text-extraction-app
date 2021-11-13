module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "firebasestorage.googleapis.com"],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dzilzrhfk/image/fetch/',
  },
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
};
