import { ApiError, ProductsService } from "./api";

/** Builds a `Response`-like object as returned by the real `GET /products` endpoint. */
function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

const rawProduct = (overrides: Partial<{ id: number; name: string; price: string }> = {}) => ({
  id: 1,
  name: "Backpack",
  description: "Uma mochila resistente.",
  image: "https://softstar.s3.amazonaws.com/items/backpack.png",
  price: "182.00000000",
  createdAt: "2024-07-18T23:55:43.238Z",
  ...overrides,
});

describe("ProductsService", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  describe("getProducts", () => {
    it("normalizes the raw { products, count } response into { data, metadata }", async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ products: [rawProduct(), rawProduct({ id: 2, name: "Boots" })], count: 32 }),
      );

      const result = await ProductsService.getProducts({ page: 1, limit: 8 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({ id: 1, name: "Backpack", price: 182 });
      expect(result.metadata).toEqual({ page: 1, limit: 8, totalCount: 32, pageCount: 4 });
    });

    it("parses the decimal-string price into a number", async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ products: [rawProduct({ price: "338.00000000" })], count: 1 }),
      );

      const result = await ProductsService.getProducts();

      expect(result.data[0].price).toBe(338);
    });

    it("sends the required page/rows/sortBy/orderBy query params", async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ products: [], count: 0 }));

      await ProductsService.getProducts({ page: 2, limit: 8, sortBy: "price", orderBy: "DESC" });

      const [url] = fetchMock.mock.calls[0];
      const parsed = new URL(url as string);
      expect(parsed.searchParams.get("page")).toBe("2");
      expect(parsed.searchParams.get("rows")).toBe("8");
      expect(parsed.searchParams.get("sortBy")).toBe("price");
      expect(parsed.searchParams.get("orderBy")).toBe("DESC");
    });

    it("clamps rows to the API's [5, 50] range", async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ products: [], count: 0 }));
      await ProductsService.getProducts({ limit: 1 });
      expect(new URL(fetchMock.mock.calls[0][0] as string).searchParams.get("rows")).toBe("5");

      fetchMock.mockResolvedValueOnce(jsonResponse({ products: [], count: 0 }));
      await ProductsService.getProducts({ limit: 999 });
      expect(new URL(fetchMock.mock.calls[1][0] as string).searchParams.get("rows")).toBe("50");
    });

    it("throws an ApiError when the request fails", async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ message: "bad request" }, 400));
      await expect(ProductsService.getProducts()).rejects.toThrow(ApiError);
    });
  });

  describe("getAllProducts", () => {
    it("walks every page and concatenates the results", async () => {
      const page1Products = Array.from({ length: 50 }, (_, i) => rawProduct({ id: i + 1 }));
      const page2Products = Array.from({ length: 2 }, (_, i) => rawProduct({ id: i + 51 }));

      fetchMock
        .mockResolvedValueOnce(jsonResponse({ products: page1Products, count: 52 }))
        .mockResolvedValueOnce(jsonResponse({ products: page2Products, count: 52 }));

      const all = await ProductsService.getAllProducts();

      expect(all).toHaveLength(52);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(all[51].id).toBe(52);
    });
  });

  describe("getProductById", () => {
    it("finds a product within the fetched catalogue", async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ products: [rawProduct({ id: 1 }), rawProduct({ id: 2 })], count: 2 }),
      );

      const product = await ProductsService.getProductById(2);
      expect(product.id).toBe(2);
    });

    it("throws an ApiError(404) when no product matches", async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ products: [rawProduct({ id: 1 })], count: 1 }));

      await expect(ProductsService.getProductById(999)).rejects.toMatchObject({ status: 404 });
    });
  });
});
