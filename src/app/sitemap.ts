import type { MetadataRoute } from "next";
import { ProductsService } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await ProductsService.getAllProducts();
  const nftPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/nft/${product.id}`,
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
