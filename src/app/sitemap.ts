import type { MetadataRoute } from "next";
import { getAllProductIds } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const nftPages: MetadataRoute.Sitemap = getAllProductIds().map((id) => ({
    url: `${siteUrl}/nft/${id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    ...nftPages,
  ];
}
