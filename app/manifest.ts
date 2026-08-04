import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YLC 2026",
    short_name: "YLC",
    description: "Youth Leadership Conference pocket guide",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7fbfa",
    theme_color: "#2f9f9a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
