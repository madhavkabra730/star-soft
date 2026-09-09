import { type NextRequest, NextResponse } from "next/server";
import { ProductsService, ApiError, DEFAULT_PAGE_SIZE } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? DEFAULT_PAGE_SIZE);

  try {
    const data = await ProductsService.getProducts({ page, limit });
    return NextResponse.json(data);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json({ error: "Failed to fetch products" }, { status });
  }
}
