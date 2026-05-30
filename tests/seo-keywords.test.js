import { describe, expect, test } from "bun:test";
import { buildSeoKeywords } from "../src/utils/seo/keywords";
import { getErgNewsMockBySlug } from "../src/mocks/erg-news";
import { getTrainingFieldBySlug, getTrainingFieldSeo } from "../src/constants/training-fields";

describe("SEO keywords", () => {
    test("extracts meaningful keyword phrases from rich mock post content", () => {
        const keywords = buildSeoKeywords({
            title: "Tin học văn phòng - Kỹ năng bắt buộc trong thời đại số",
            description: "Khóa học thực tế cho người mới bắt đầu",
            content: `
                <h2>Bạn sẽ học được gì?</h2>
                <p>Word nhanh đẹp chuẩn chuyên nghiệp, Excel từ cơ bản đến nâng cao, PowerPoint ấn tượng.</p>
                <p>Thực hành 80% thời lượng, phù hợp cho học sinh, sinh viên và người mất gốc tin học.</p>
            `,
            seedKeywords: ["ERG"],
        });

        expect(keywords).toContain("tin học văn phòng");
        expect(keywords).toContain("Word");
        expect(keywords).toContain("Excel");
        expect(keywords).toContain("PowerPoint");
        expect(keywords).toContain("người mới bắt đầu");
        expect(keywords).toContain("thực hành");
    });

    test("mock news posts include derived search keywords from their content", () => {
        const summerPost = getErgNewsMockBySlug("khoa-ban-tru-he-2026-he-but-pha-kien-tao-tuong-lai");
        const officePost = getErgNewsMockBySlug("tin-hoc-van-phong-ky-nang-bat-buoc-trong-thoi-dai-so-cung-erg");
        const digitalPost = getErgNewsMockBySlug("hoc-tin-hoc-tu-som-mo-rong-tuong-lai-so-cung-erg-edurise-global");

        expect(summerPost?.keywords).toContain("IC3 Spark");
        expect(summerPost?.keywords).toContain("Scratch Jr");
        expect(summerPost?.keywords).toContain("Gala");
        expect(officePost?.keywords).toContain("người mới bắt đầu");
        expect(officePost?.keywords).toContain("thực hành");
        expect(digitalPost?.keywords).toContain("công dân số");
        expect(digitalPost?.keywords).toContain("làm chủ công nghệ");
    });

    test("summer mock post carries a broad keyword set for ban tru he and programs", () => {
        const summerPost = getErgNewsMockBySlug("khoa-ban-tru-he-2026-he-but-pha-kien-tao-tuong-lai");
        const keywords = summerPost?.keywords.split(",").map((keyword) => keyword.trim()) || [];

        expect(keywords.length).toBeGreaterThanOrEqual(45);
        expect(keywords).toContain("khóa bán trú hè 2026");
        expect(keywords).toContain("trại hè bán trú");
        expect(keywords).toContain("hè cho học sinh tiểu học");
        expect(keywords).toContain("chương trình hè cho THCS");
        expect(keywords).toContain("tiền tiểu học");
        expect(keywords).toContain("rèn chữ");
        expect(keywords).toContain("dự án PowerPoint");
        expect(keywords).toContain("ngày hội Tin học STEM");
    });

    test("training sitemap detail pages get keywords from page content sections", () => {
        const field = getTrainingFieldBySlug("tri-tue-nhan-tao-ai");
        expect(field).toBeTruthy();

        const seo = getTrainingFieldSeo(field);

        expect(seo.keywords).toContain("machine learning");
        expect(seo.keywords).toContain("dữ liệu");
        expect(seo.keywords).toContain("đạo đức");
        expect(seo.keywords).toContain("tự động hóa");
    });
    test("all training sitemap detail pages get a richer keyword set", () => {
        for (const slug of ["ic3-gs6", "mos", "tin-hoc-co-ban-nang-cao", "lap-trinh-thieu-nhi", "stem-robotics", "tin-hoc-tre"]) {
            const field = getTrainingFieldBySlug(slug);
            expect(field).toBeTruthy();
            expect(getTrainingFieldSeo(field).keywords.length).toBeGreaterThanOrEqual(20);
        }
    });
});
