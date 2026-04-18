// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mammoth", "pg", "@xenova/transformers"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;