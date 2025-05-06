module.exports = {
  env: {
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*", // Proxy to FastAPI
      },
    ];
  },
};
