import { NextResponse, type NextRequest } from "next/server";
import { getProductsPage } from "@/lib/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/api";

/**
 * GET /api/products?page=1&limit=8
 *
 * Serves the local NFT seed data with the same pagination contract as the
 * original (now offline) Starsoft Challenge API. See src/lib/api.ts for why
 * this exists.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE);

  return NextResponse.json(getProductsPage(page, limit));
}
