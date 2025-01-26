/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
};

module.exports = {
  serverRuntimeConfig: {
    ssg_count_top_artists: 50,
    ssg_interval_artist_artworks: 600, // 10 minutes
  },
  publicRuntimeConfig: {
    address_1: "0xTODO",
    address_2: "0xTODO",
    address_3: "0xTODO",
  },
};
