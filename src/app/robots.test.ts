import robots from "./robots";

describe("robots", () => {
  it("allows crawling the site but not the API, and points at the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(result.sitemap).toBe("http://localhost:3000/sitemap.xml");
  });
});
