import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Keel",
    short_name: "Keel",
    description: "Systems for people.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f0e8",
    theme_color: "#1c1916",
    lang: "en",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
