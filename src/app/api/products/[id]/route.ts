import { NextResponse } from "next/server";
import { ProductsService, ApiError } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const product = await ProductsService.getProductById(Number(id));
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
