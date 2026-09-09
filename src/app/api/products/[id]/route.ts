import { NextResponse } from "next/server";
import { getAllProductIds, getProductById } from "@/lib/products";

/** GET /api/products/[id] — returns a single NFT or 404. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id: String(id) }));
}
