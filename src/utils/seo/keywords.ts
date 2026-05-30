const DEFAULT_MAX_KEYWORDS = 80;

const KEYWORD_CATALOG = [
    "khóa hè 2026",
    "bán trú hè",
    "Toán tư duy",
    "Tiếng Việt",
    "Tiếng Anh giao tiếp",
    "Tin học ứng dụng",
    "STEM",
    "STEM Lập trình",
    "Scratch Jr",
    "Scratch",
    "Python",
    "Arduino",
    "Robotics",
    "IC3",
    "IC3 GS6",
    "IC3 Spark",
    "MOS",
    "Word",
    "Excel",
    "PowerPoint",
    "tin học văn phòng",
    "kỹ năng số",
    "công dân số",
    "làm chủ công nghệ",
    "người mới bắt đầu",
    "thực hành",
    "thực hành 80%",
    "tư duy logic",
    "tư duy thuật toán",
    "máy tính",
    "Internet",
    "an toàn số",
    "an toàn thông tin",
    "dữ liệu",
    "machine learning",
    "học máy",
    "mô hình dự đoán",
    "tự động hóa",
    "đạo đức",
    "AI",
    "trí tuệ nhân tạo",
    "lập trình thiếu nhi",
    "Tin học trẻ",
    "học sinh giỏi Tin học",
    "lập trình thi đấu",
    "Gala",
    "giáo viên tin học",
    "giáo viên STEM",
    "trợ giảng",
    "giáo vụ",
    "IT Helpdesk",
    "quản trị mạng",
    "kinh doanh B2B",
    "Next.js",
    "Node.js",
    "E-learning",
];

const BOOSTED_KEYWORD_CATALOG = [
    ...KEYWORD_CATALOG,
    "khóa bán trú hè 2026",
    "trại hè bán trú",
    "hè bán trú ERG",
    "lớp bán trú hè",
    "chương trình hè",
    "chương trình hè cho THCS",
    "hè cho học sinh tiểu học",
    "hè cho học sinh cấp 1",
    "hè cho học sinh cấp 2",
    "tiền tiểu học",
    "chuẩn bị vào lớp 1",
    "rèn chữ",
    "luyện viết chữ đẹp",
    "dự án PowerPoint",
    "ngày hội Tin học STEM",
    "sản phẩm Scratch",
    "mô hình robot",
    "sân khấu hóa",
    "kỹ năng thuyết trình",
    "làm việc nhóm",
    "học hè 2026",
    "Gala tổng kết",
    "Global Digital Literacy Standard",
    "Microsoft Office Specialist",
    "CNTT cơ bản",
    "CNTT nâng cao",
    "chứng chỉ CNTT",
    "chứng chỉ tin học",
    "liên kết đào tạo",
    "đào tạo tin học",
    "đào tạo CNTT",
    "giải quyết vấn đề",
    "cấu trúc dữ liệu",
    "dynamic programming",
    "graph",
    "lập trình Scratch",
    "lập trình Python",
    "lập trình robot",
    "robot giáo dục",
];

const stripHtml = (value: string) =>
    value
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();

const normalizeForMatch = (value: string) =>
    stripHtml(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();

const splitSeedKeywords = (keywords: string | string[] | undefined) => {
    if (!keywords) return [];
    return Array.isArray(keywords)
        ? keywords
        : keywords.split(",");
};

const addKeyword = (keywords: string[], seen: Set<string>, value?: string) => {
    const keyword = value?.replace(/\s+/g, " ").trim();
    if (!keyword || keyword.length < 2) return;

    const key = normalizeForMatch(keyword);
    if (seen.has(key)) return;

    keywords.push(keyword);
    seen.add(key);
};

const splitTitlePhrases = (title?: string) =>
    stripHtml(title || "")
        .split(/[\-|–|—|:|,|;|/|()]+/g)
        .map((item) => item.trim())
        .filter((item) => item.length >= 4 && item.split(/\s+/).length <= 8);

const includesKeyword = (source: string, keyword: string) => {
    const normalizedSource = normalizeForMatch(source);
    const normalizedKeyword = normalizeForMatch(keyword);
    if (normalizedKeyword.length <= 3) {
        const originalKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`(^|[^\\p{L}\\p{N}])${originalKeyword}([^\\p{L}\\p{N}]|$)`, "u").test(stripHtml(source));
    }

    return normalizedSource.includes(normalizedKeyword);
};

export function buildSeoKeywords({
    title,
    description,
    content,
    sections = [],
    seedKeywords,
    maxKeywords = DEFAULT_MAX_KEYWORDS,
}: {
    title?: string;
    description?: string;
    content?: string;
    sections?: Array<string | undefined>;
    seedKeywords?: string | string[];
    maxKeywords?: number;
}) {
    const sourceText = [title, description, content, ...sections].filter(Boolean).join(" ");
    const keywords: string[] = [];
    const seen = new Set<string>();

    splitSeedKeywords(seedKeywords).forEach((keyword) => addKeyword(keywords, seen, keyword));

    BOOSTED_KEYWORD_CATALOG.forEach((keyword) => {
        if (includesKeyword(sourceText, keyword)) {
            addKeyword(keywords, seen, keyword);
        }
    });
    splitTitlePhrases(title).forEach((keyword) => addKeyword(keywords, seen, keyword));

    return keywords.slice(0, maxKeywords);
}
