import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained server bundle for the Docker image.
  output: "standalone",
  experimental: {
    serverActions: {
      // Next's own default (1MB) sits well under our own upload validation
      // limit (lib/media-validation.ts, 15MB), so a real photo or poster
      // flyer over ~1MB used to blow up with a raw "Body exceeded 1 MB
      // limit" crash before our code — or any friendly error message —
      // ever ran. This just needs to clear MAX_IMAGE_BYTES plus multipart
      // overhead so our own validation is always what actually judges an
      // upload.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
