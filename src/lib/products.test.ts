import { getAllProductIds, getProductById, getProductsPage } from "./products";
import { MOCK_PRODUCTS } from "@/mocks/products";

describe("getProductsPage", () => {
  it("returns the requested slice with correct pagination metadata", () => {
    const result = getProductsPage(1, 8);
    expect(result.data).toHaveLength(8);
    expect(result.data[0].id).toBe(1);
    expect(result.metadata).toEqual({
      page: 1,
      pageCount: Math.ceil(MOCK_PRODUCTS.length / 8),
      totalCount: MOCK_PRODUCTS.length,
      limit: 8,
    });
  });

  it("returns the next page's items, not the first page's", () => {
    const page1 = getProductsPage(1, 8);
    const page2 = getProductsPage(2, 8);
    const page1Ids = page1.data.map((item) => item.id);
    const page2Ids = page2.data.map((item) => item.id);
    expect(page1Ids).not.toEqual(page2Ids);
  });

  it("returns an empty array past the last page", () => {
    const lastPage = Math.ceil(MOCK_PRODUCTS.length / 8) + 1;
    const result = getProductsPage(lastPage, 8);
    expect(result.data).toHaveLength(0);
  });
});

describe("getProductById", () => {
  it("finds a product that exists", () => {
    expect(getProductById(1)?.id).toBe(1);
  });

  it("returns undefined for an id that doesn't exist", () => {
    expect(getProductById(99999)).toBeUndefined();
  });
});

describe("getAllProductIds", () => {
  it("returns one id per mock product", () => {
    expect(getAllProductIds()).toHaveLength(MOCK_PRODUCTS.length);
  });
});
