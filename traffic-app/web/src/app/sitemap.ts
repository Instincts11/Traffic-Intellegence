import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://traffic.ai";
  const paths = [
    "",
    "/product",
    "/technology",
    "/research",
    "/network",
    "/map",
    "/influence",
    "/upload",
    "/predict",
    "/detect",
    "/company",
    "/developers",
    "/contact",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
