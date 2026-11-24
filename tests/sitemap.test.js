import { beforeEach, describe, expect, mock, test } from "bun:test";

let mockedHost = "erg.edu.vn";

mock.module("next/headers", () => ({
    headers: async () => new Headers({ host: mockedHost }),
}));

describe("sitemap", () => {
    beforeEach(() => {
        mockedHost = "erg.edu.vn";
        process.env.BACKEND_URL = "http://backend.test";
        process.env.NEXT_PUBLIC_ROOT_DOMAIN = "erg.edu.vn";
        process.env.NEXT_PUBLIC_BASE_URL = "https://erg.edu.vn";
        process.env.BUILD_DATE = "2026-05-30T00:00:00.000Z";
        globalThis.fetch = mock(async () => {
            throw new Error("backend unavailable");
        });
    });

    test("keeps static routes and no mock posts when backend sitemap is unavailable", async () => {
        const { default: sitemap } = await import("../src/app/sitemap");

        const urls = (await sitemap()).map((entry) => entry.url);

        expect(urls).toContain("https://erg.edu.vn/");
        expect(urls).toContain("https://erg.edu.vn/tin-tuc");
        expect(urls).toContain("https://erg.edu.vn/tuyen-dung");
        expect(urls).not.toContain("https://erg.edu.vn/cong-khai");
        expect(urls).toContain("https://erg.edu.vn/tim-kiem");
        expect(urls.filter((url) => url.startsWith("https://erg.edu.vn/tin-tuc/"))).toEqual([]);
        expect(urls.filter((url) => url.startsWith("https://erg.edu.vn/tuyen-dung/"))).toEqual([]);
        expect(urls.some((url) => url.includes("elearning.") || url.includes("forum."))).toBe(false);
    });

    test("returns only static routes when backend sitemap returns no dynamic urls", async () => {
        const { default: sitemap } = await import("../src/app/sitemap");
        globalThis.fetch = mock(async () => Response.json({ data: { urls: [] } }));

        const urls = (await sitemap()).map((entry) => entry.url);

        expect(urls.filter((url) => url.startsWith("https://erg.edu.vn/tin-tuc/"))).toEqual([]);
    });

    test("adds backend urls with real lastmod, drops other hosts and normalizes trailing slash", async () => {
        const { default: sitemap } = await import("../src/app/sitemap");
        globalThis.fetch = mock(async () => Response.json({ data: { urls: [
            { loc: "/tin-tuc/bai-that/", lastmod: "2026-05-01T00:00:00.000Z" },
            { loc: "https://other.example/tin-tuc/x" },
            { loc: "/tin-tuc/khong-lastmod" },
        ] } }));

        const entries = await sitemap();
        const real = entries.find((entry) => entry.url === "https://erg.edu.vn/tin-tuc/bai-that");
        const noDate = entries.find((entry) => entry.url === "https://erg.edu.vn/tin-tuc/khong-lastmod");

        expect(real?.lastModified).toBe("2026-05-01T00:00:00.000Z");
        expect(noDate?.lastModified).toBeUndefined();
        expect(entries.some((entry) => entry.url.includes("other.example"))).toBe(false);
    });

    test("sitemap is empty for non-indexed elearning host", async () => {
        mockedHost = "elearning.erg.edu.vn";
        const { default: sitemap } = await import("../src/app/sitemap");

        expect(await sitemap()).toEqual([]);
    });

    test("uses http urls and image sitemap entries for local dev domain with port", async () => {
        mockedHost = "erg.edu.vn:3000";
        const { default: sitemap } = await import("../src/app/sitemap");

        const entries = await sitemap();
        const urls = entries.map((entry) => entry.url);
        const trainingDetail = entries.find((entry) => entry.url === "http://erg.edu.vn:3000/linh-vuc-dao-tao/ic3-gs6");

        expect(urls).toContain("http://erg.edu.vn:3000/linh-vuc-dao-tao");
        expect(urls).toContain("http://erg.edu.vn:3000/linh-vuc-dao-tao/ic3-gs6");
        expect(trainingDetail?.images).toContain("http://erg.edu.vn:3000/util/ic3.jpg");
    });

    test("escapes image urls so sitemap xml does not break on query params", async () => {
        mockedHost = "erg.edu.vn:3000";
        const { default: sitemap } = await import("../src/app/sitemap");

        const imageUrls = (await sitemap()).flatMap((entry) => entry.images || []);

        expect(imageUrls.some((image) => image.includes("images.unsplash.com"))).toBe(true);
        expect(imageUrls.filter((image) => /&(?!amp;)/.test(image)).length).toBe(0);
        expect(imageUrls.some((image) => image.includes("&amp;fit="))).toBe(true);
    });
});
