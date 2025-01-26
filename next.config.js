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
    address_1: "0xBF9cEb21Ac5D1ca86F1F33cF41BddEF56EED5418",
    address_2: "0x0F1064086f4585e2D361F6Ba8C8532170Eddf299",
    address_3: "0x96b9a71a1BebeE58248b2F610F0656E406823381",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:9000/api/:path*",
        //destination: "http://8.210.159.52:18080/api/auth/:path*",
      },
      {
        source: "/api/bs/:path*",
        destination: "http://127.0.0.1:9000/api/bs/:path*",
        //destination: "http://8.210.159.52:18081/api/bs/:path*",
      },
    ];
  },
};
