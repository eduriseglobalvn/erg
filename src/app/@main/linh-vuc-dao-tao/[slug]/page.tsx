import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    CheckCircle2,
    Layers,
    Target,
    Users
} from 'lucide-react';
import {
    TRAINING_CONTACT_URL,
    TRAINING_FIELDS,
    getTrainingFieldBySlug,
    getTrainingFieldSeo
} from '@/constants/training-fields';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { generateCanonical } from '@/utils/seo/seo-metadata';

type PageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return TRAINING_FIELDS.map((field) => ({ slug: field.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const field = getTrainingFieldBySlug(slug);

    if (!field) {
        return {
            title: 'Chương trình đào tạo',
            description: 'Thông tin chương trình đào tạo tại ERG.'
        };
    }

    const seo = getTrainingFieldSeo(field);
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';
    const canonicalUrl = generateCanonical(host, field.link);
    const imageUrl = field.image.startsWith('http')
        ? field.image
        : generateCanonical(host, field.image);

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            type: 'website',
            title: seo.title,
            description: seo.description,
            url: canonicalUrl,
            images: [{ url: imageUrl, alt: field.imageAlt, width: 1200, height: 630 }]
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
            images: [imageUrl],
        },
    };
}

function buildTrainingFaq(field: NonNullable<ReturnType<typeof getTrainingFieldBySlug>>) {
    return [
        {
            question: `${field.title} phù hợp với ai?`,
            answer: field.audience.join(' '),
        },
        {
            question: `Học ${field.title} tại ERG nhận được gì?`,
            answer: field.outcomes.join(' '),
        },
        {
            question: `Làm sao để được tư vấn chương trình ${field.title}?`,
            answer: 'Phụ huynh và học viên có thể liên hệ ERG qua Zalo 0766.144.888 để được tư vấn lộ trình phù hợp với mục tiêu, độ tuổi và nền tảng hiện tại.',
        },
    ];
}

function InfoList({
    title,
    icon,
    items,
}: {
    title: string;
    icon: React.ReactNode;
    items: string[];
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#00008b]">
                    {icon}
                </div>
                <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            </div>
            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#cc0022]" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const tinHocTreCourses = [
    {
        title: "Scratch Cơ Bản",
        level: "6-10 tuổi",
        desc: "Lập trình kéo thả, game và hoạt hình sáng tạo",
        detailId: "chi-tiet-scratch",
    },
    {
        title: "Python Cơ Bản",
        level: "11-14 tuổi",
        desc: "Tư duy thuật toán và lập trình nền tảng",
        detailId: "chi-tiet-python",
    },
    {
        title: "Luyện Thi Tin Học Trẻ",
        level: "Đội tuyển cấp Thành phố",
        desc: "Thuật toán, đề thi và kỹ năng thi đấu",
        detailId: "chi-tiet-luyen-thi-tin-hoc-tre",
    },
];

const courseDetails = [
    {
        id: "chi-tiet-scratch",
        title: "Khóa học Lập trình Scratch",
        badge: "Lập trình Thiếu nhi",
        tone: "orange",
        intro: [
            "Scratch là phần mềm lập trình đồ họa dành cho trẻ em với các công cụ giúp học sinh tiếp cận công nghệ lập trình bằng những ngôn ngữ cơ bản và đơn giản nhất.",
            "Thay vì phải viết những dòng lệnh phức tạp, các em có thể tự thiết kế nhân vật bằng cách kéo thả và lắp ghép các khối lệnh đầy màu sắc giống như chơi Lego. Từ đó, trẻ dễ dàng tạo ra trò chơi thú vị, rèn tư duy lập trình và tính kiên trì.",
        ],
        valuesTitle: "Trẻ em sẽ học được gì?",
        values: [
            "Rèn luyện tính kiên trì, cẩn thận trong học tập và cuộc sống.",
            "Bồi dưỡng niềm say mê học tập, tính tự giác giải quyết công việc.",
            "Kích thích và phát huy trí tưởng tượng phong phú.",
            "Biết diễn đạt ý tưởng, suy nghĩ một cách chặt chẽ, logic.",
            "Biết chọn lọc và thử nghiệm các ý tưởng mới.",
            "Biết phân chia và phối hợp trong khi làm việc nhóm.",
            "Biết xử lý lỗi (debug) và tìm các giải pháp thay thế.",
            "Rèn luyện kỹ năng thuyết trình, giải thích mạch lạc.",
        ],
        audience: [
            "Học sinh chưa biết gì về lập trình, muốn bắt đầu từ con số 0.",
            "Học sinh từ lớp 4 bắt đầu làm quen với tư duy máy tính.",
            "Học sinh yêu thích game, muốn tự tay thiết kế trò chơi riêng.",
        ],
        curriculum: [
            "Tư duy máy tính và làm quen với Scratch",
            "Tạo Sprites và chuyển động",
            "Vẽ hình trong Scratch",
            "Âm thanh trong Scratch",
            "Điều khiển rẽ nhánh (Phần 1)",
            "Điều khiển rẽ nhánh (Phần 2)",
            "Vòng lặp (Phần 1)",
            "Vòng lặp (Phần 2)",
            "Hội thoại và truyền thông",
            "Cảm biến",
            "Thực hiện dự án học tập (Phần 1)",
            "Hoàn thiện dự án, thuyết trình & đánh giá",
        ],
    },
    {
        id: "chi-tiet-python",
        title: "Khóa học Lập trình Python",
        badge: "Lập trình Thiếu nhi & THCS",
        tone: "blue",
        intro: [
            "Python là ngôn ngữ lập trình mạnh mẽ, dễ đọc và được sử dụng rộng rãi trong AI, Web và Data Science. Khóa học được thiết kế đặc biệt cho học sinh THCS để làm quen với lập trình dòng lệnh (text-based coding).",
            "Không chỉ dừng lại ở việc viết code, khóa học còn hướng dẫn học sinh tạo ra sản phẩm thực tế như game đơn giản, game giao diện 2D và các chương trình tính toán thông minh, giúp các em thấy được sức mạnh của công nghệ.",
        ],
        valuesTitle: "Giá trị nhận được",
        values: [
            "Tiếp cận ngôn ngữ lập trình thực tế số 1 thế giới hiện nay.",
            "Rèn luyện tư duy logic, mạch lạc thông qua việc viết code.",
            "Hiểu bản chất máy tính: biến, vòng lặp, hàm, cấu trúc dữ liệu.",
            "Tự tay lập trình game đơn giản, game giao diện 2D với Pygame.",
            "Phát triển kỹ năng giải quyết vấn đề và sửa lỗi (debugging).",
            "Tạo nền tảng vững chắc để tiếp cận AI và khoa học dữ liệu sau này.",
        ],
        audience: [
            "Học sinh từ lớp 6 trở lên có đam mê và muốn tìm hiểu ngôn ngữ lập trình.",
            "Học sinh có định hướng theo đuổi công nghệ và trở thành lập trình viên trong tương lai.",
            "Học sinh muốn chuyển từ lập trình kéo thả Scratch sang lập trình dòng lệnh chuyên nghiệp.",
        ],
        curriculum: [
            "Bắt đầu với Python: giới thiệu, cài đặt môi trường, lệnh print đơn giản.",
            "Biến và cú pháp Python: từ khóa, phép gán, nhập liệu, bài toán nhập xuất.",
            "Kiểu dữ liệu Number: phép toán số học và toán tử so sánh.",
            "Điều khiển rẽ nhánh: if/elif/else, kiểm tra chẵn lẻ, chia hết.",
            "Vòng lặp có giới hạn (For): tính tổng dãy số, trung bình cộng.",
            "Vòng lặp vô hạn (While): phân biệt For/While, bài toán tìm số.",
            "Chương trình con (Hàm): khai báo, gọi hàm và bài tập minh họa.",
            "Kiểu dữ liệu xâu (String): phép toán với chuỗi, so sánh, in/not in.",
            "Mini Projects (Pygame): giới thiệu thư viện và làm game cơ bản.",
            "Mini Projects thực hành: phát triển game/ứng dụng cá nhân.",
            "Hoàn thiện projects & debug: sửa lỗi, hoàn thiện sản phẩm.",
            "Tổng kết & báo cáo: trình bày sản phẩm, kiểm tra và đánh giá cuối khóa.",
        ],
    },
    {
        id: "chi-tiet-luyen-thi-tin-hoc-tre",
        title: "Luyện Thi Tin Học Trẻ",
        badge: "Định hướng 2025-2026",
        tone: "blue",
        intro: [
            "Chương trình luyện thi Tin học trẻ được thiết kế theo định hướng mới của Hội thi Tin học trẻ toàn quốc giai đoạn 2025-2026: học sinh cần vừa có năng lực lập trình thuật toán, vừa biết xây dựng sản phẩm sáng tạo và trình bày ý tưởng công nghệ rõ ràng.",
            "Ở cấp tiểu học, học sinh được rèn Scratch hoặc Python để giải bài toán phù hợp lứa tuổi; từ THCS trở lên, lộ trình chuyển dần sang Python/C++ và tư duy chấm điểm trực tuyến. Với nhóm sản phẩm sáng tạo, học sinh được hướng dẫn hồ sơ thuyết minh, demo, mã nguồn và kỹ năng thuyết trình.",
        ],
        valuesTitle: "Năng lực trọng tâm",
        values: [
            "Đọc đề nhanh, xác định dữ liệu vào ra và chia nhỏ bài toán.",
            "Luyện biến, điều kiện, vòng lặp, mảng, chuỗi, ma trận và tìm kiếm cơ bản.",
            "Làm quen hình thức thi trực tuyến, nộp bài, đọc kết quả và tối ưu theo test.",
            "Rèn tốc độ, độ chính xác và thói quen kiểm thử trước khi nộp bài.",
            "Phát triển sản phẩm sáng tạo có ý tưởng, tính ứng dụng và phần mềm rõ ràng.",
            "Tập trình bày sản phẩm, giải thích thuật toán và bảo vệ cách làm trước giám khảo.",
        ],
        audience: [
            "Học sinh tiểu học muốn thi bảng A hoặc bảng sản phẩm sáng tạo D1 với Scratch/Python.",
            "Học sinh THCS hướng tới bảng B hoặc bảng sản phẩm sáng tạo D2.",
            "Học sinh đã học Scratch/Python và cần lộ trình luyện đề, thi thử, chữa bài trước các vòng cấp Quận, Thành phố, Khu vực.",
        ],
        curriculum: [
            "Đánh giá đầu vào: nền tảng Scratch/Python, tư duy logic và mục tiêu bảng thi.",
            "Kỹ năng đọc đề: xác định input/output, ví dụ mẫu, giới hạn và lỗi thường gặp.",
            "Biến, nhập xuất, biểu thức và điều kiện trong bài toán thi.",
            "Vòng lặp, đếm, tính tổng, tìm min-max và các bài toán số học cơ bản.",
            "Mảng, chuỗi, ma trận và kỹ thuật duyệt dữ liệu.",
            "Tìm kiếm, sắp xếp cơ bản và tối ưu lời giải theo thời gian.",
            "Luyện đề bảng A/B theo cấp độ, có giới hạn thời gian và chữa bài chi tiết.",
            "Mini contest: thi thử, review code, sửa lỗi logic và cải thiện tốc độ nộp bài.",
            "Sản phẩm sáng tạo: chọn ý tưởng, thiết kế chức năng, chuẩn bị mã nguồn và demo.",
            "Thuyết minh sản phẩm: mô tả vấn đề, giải pháp, tính sáng tạo và khả năng ứng dụng.",
            "Mô phỏng vòng thi: quy trình đăng nhập, làm bài, nộp bài và xử lý áp lực thời gian.",
            "Tổng ôn: chiến lược làm bài, checklist trước khi thi và định hướng vòng tiếp theo.",
        ],
    },
];

const tinHocTreFeatures = [
    "Lộ trình theo bảng A, B và sản phẩm sáng tạo D1-D2",
    "Scratch/Python cho tiểu học, Python/C++ cho THCS",
    "Luyện đề theo thời gian trên mô hình chấm trực tuyến",
    "Mini contest, thi thử và chữa bài hằng tuần",
    "Huấn luyện hồ sơ thuyết minh, demo và trình bày sản phẩm",
    "Bài tập phân tầng theo độ tuổi và mục tiêu thi",
];

const tinHocTreSchedules = [
    {
        week: "Tuần 1-2",
        content: "Đánh giá đầu vào, đọc đề, input/output, biến và điều kiện",
    },
    {
        week: "Tuần 3-4",
        content: "Vòng lặp, số học, đếm, tìm kiếm và tối ưu thao tác cơ bản",
    },
    {
        week: "Tuần 5-6",
        content: "Mảng, chuỗi, ma trận và kỹ thuật duyệt dữ liệu",
    },
    {
        week: "Tuần 7-8",
        content: "Luyện đề bảng A/B, mini contest và review lỗi",
    },
    {
        week: "Tuần 9-12",
        content: "Sản phẩm sáng tạo, thuyết minh, demo và thi thử tổng hợp",
    },
];

function TinHocTreHighlightsSection() {
    return (
        <section className="bg-white px-4 py-16 md:px-8 md:py-24 2xl:px-10">
            <div className="mx-auto grid w-full max-w-[1536px] items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <h2 className="mb-10 text-4xl font-black tracking-normal text-slate-900 md:text-5xl">
                        Điểm nổi bật chương trình
                    </h2>

                    <div className="space-y-6">
                        {tinHocTreFeatures.map((feature) => (
                            <div
                                key={feature}
                                className="flex min-h-20 items-center gap-3 rounded-2xl bg-slate-100 px-6 py-5 text-xl font-medium text-slate-800 shadow-sm"
                            >
                                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="lo-trinh-luyen-thi" className="scroll-mt-28 rounded-[32px] bg-gradient-to-br from-indigo-700 to-blue-700 p-8 text-white shadow-2xl md:p-10 lg:p-12">
                    <h2 className="mb-8 text-4xl font-black tracking-normal md:text-5xl">Lộ trình luyện thi</h2>

                    <div className="space-y-6">
                        {tinHocTreSchedules.map((item) => (
                            <div
                                key={item.week}
                                className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10"
                            >
                                <div className="text-2xl font-black">{item.week}</div>
                                <div className="mt-4 text-xl leading-7 text-white/90">{item.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TinHocTreLandingPage() {
    return (
        <article className="bg-slate-100 text-slate-800">
            <section className="bg-gradient-to-r from-blue-700 via-blue-700 to-indigo-800 px-4 py-16 text-white md:px-8 md:py-24 2xl:px-10">
                <div className="mx-auto grid w-full max-w-[1536px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-normal md:text-6xl lg:text-7xl">
                            LUYỆN THI TIN HỌC TRẺ
                        </h1>
                        <p className="mt-8 max-w-2xl text-xl leading-8 text-white/90 md:text-2xl">
                            Trung Tâm Tin Học ERG - Đào tạo Scratch, Python và đội tuyển Tin học trẻ cấp Thành phố.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href={TRAINING_CONTACT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                            >
                                Đăng ký học
                            </Link>

                            <a
                                href="#khoa-hoc-noi-bat"
                                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white bg-white/15 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/25 focus:outline-none focus:ring-4 focus:ring-white/30"
                            >
                                Xem khóa học
                            </a>
                        </div>
                    </div>

                    <div className="rounded-[32px] bg-white/10 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-md md:p-10">
                        <h2 className="mb-8 text-3xl font-black md:text-4xl">Thông tin nổi bật</h2>

                        <div className="space-y-5">
                            {[
                                "100+ bài luyện thuật toán",
                                "Luyện đề Tin học trẻ thực tế",
                                "Scratch & Python theo độ tuổi",
                                "Thi thử và mini contest hàng tuần",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-5 text-lg font-medium text-white ring-1 ring-white/5 md:px-7 md:text-xl"
                                >
                                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="khoa-hoc-noi-bat" className="mx-auto w-full max-w-[1536px] px-4 py-16 md:px-8 md:py-24 2xl:px-10">
                <div className="mb-14 text-center">
                    <h2 className="text-4xl font-black tracking-normal text-slate-900 md:text-5xl">
                        Khóa học nổi bật
                    </h2>
                    <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-600">
                        Chương trình được thiết kế theo từng độ tuổi và mục tiêu học tập.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {tinHocTreCourses.map((course) => (
                        <div
                            key={course.title}
                            className="rounded-[32px] bg-white p-8 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.65)] md:p-10"
                        >
                            <div className="mb-8 inline-flex rounded-full bg-blue-100 px-5 py-3 text-base font-bold text-blue-700">
                                {course.level}
                            </div>

                            <h3 className="text-3xl font-black leading-tight text-slate-900">{course.title}</h3>

                            <p className="mt-6 min-h-[72px] text-xl leading-8 text-slate-600">{course.desc}</p>

                            <Link
                                href={`#${course.detailId}`}
                                className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-blue-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <TinHocTreHighlightsSection />

            <section className="bg-white px-4 py-16 md:px-8 md:py-24 2xl:px-10">
                <div className="mx-auto w-full max-w-[1536px] space-y-10">
                    {courseDetails.map((course) => {
                        const isScratch = course.tone === "orange";
                        const accentText = isScratch ? "text-orange-600" : "text-blue-700";
                        const accentBg = isScratch ? "bg-orange-50" : "bg-blue-50";
                        const accentBorder = isScratch ? "border-orange-200" : "border-blue-200";
                        const accentButton = isScratch ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-700 hover:bg-blue-800";

                        return (
                            <section
                                id={course.id}
                                key={course.id}
                                className={`scroll-mt-28 rounded-[32px] border ${accentBorder} bg-white p-6 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.55)] md:p-10`}
                            >
                                <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                                    <div>
                                        <div className={`mb-5 inline-flex rounded-full ${accentBg} px-5 py-2 text-sm font-bold uppercase tracking-[0.14em] ${accentText}`}>
                                            {course.badge}
                                        </div>
                                        <h2 className="text-4xl font-black tracking-normal text-slate-900 md:text-5xl">
                                            {course.title}
                                        </h2>
                                        <div className="mt-6 space-y-4 text-lg leading-8 text-slate-600">
                                            {course.intro.map((paragraph) => (
                                                <p key={paragraph}>{paragraph}</p>
                                            ))}
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="mb-4 text-2xl font-black text-slate-900">Đối tượng tham gia</h3>
                                            <div className="space-y-3">
                                                {course.audience.map((item) => (
                                                    <div key={item} className={`rounded-2xl border ${accentBorder} ${accentBg} px-5 py-4 text-base font-semibold leading-7 text-slate-700`}>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Link
                                            href={TRAINING_CONTACT_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-8 inline-flex min-h-14 items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-white transition focus:outline-none focus:ring-4 focus:ring-blue-200 ${accentButton}`}
                                        >
                                            Đăng ký tư vấn
                                        </Link>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="mb-5 text-2xl font-black text-slate-900">{course.valuesTitle}</h3>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {course.values.map((item) => (
                                                    <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-base font-medium leading-7 text-slate-700">
                                                        <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${accentText}`} />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-5 text-2xl font-black text-slate-900">Nội dung khóa học</h3>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {course.curriculum.map((item, index) => (
                                                    <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                                        <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full ${accentBg} text-sm font-black ${accentText}`}>
                                                            {index + 1}
                                                        </div>
                                                        <p className="text-base font-semibold leading-7 text-slate-800">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </section>

            <section className="px-4 py-16 md:px-8 md:py-24 2xl:px-10">
                <div className="mx-auto w-full max-w-[1536px] rounded-[32px] bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-12 text-center shadow-xl md:px-10 md:py-16">
                    <h2 className="text-4xl font-black tracking-normal text-slate-900 md:text-5xl">
                        Sẵn sàng tham gia đội tuyển?
                    </h2>

                    <p className="mx-auto mt-6 max-w-4xl text-xl leading-8 text-slate-800">
                        Học cùng giáo viên chuyên luyện thi Tin học trẻ với hệ thống bài tập, đề thi và lộ trình bài bản.
                    </p>
                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={TRAINING_CONTACT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-black px-10 py-4 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-black/20"
                        >
                            Đăng ký ngay
                        </Link>

                        <Link
                            href={TRAINING_CONTACT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-10 py-4 text-lg font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-white/50"
                        >
                            Tư vấn miễn phí
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    );
}

export default async function TrainingFieldDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const field = getTrainingFieldBySlug(slug);

    if (!field) notFound();

    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';
    const breadcrumbItems = generateBreadcrumbItems(
        field.link,
        field.title,
        'Trang chủ'
    );
    const seo = getTrainingFieldSeo(field);
    const faqQuestions = buildTrainingFaq(field);

    if (field.slug === 'tin-hoc-tre') {
        return (
            <>
                <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
                <SchemaScript
                    type="Course"
                    data={{
                        title: field.title,
                        description: seo.description,
                        url: field.link,
                        image: field.image,
                        keywords: seo.keywords,
                        audience: field.audience,
                    }}
                    domain={host}
                />
                <SchemaScript type="FAQPage" data={{ questions: faqQuestions }} domain={host} />
                <TinHocTreLandingPage />
            </>
        );
    }

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <SchemaScript
                type="Course"
                data={{
                    title: field.title,
                    description: seo.description,
                    url: field.link,
                    image: field.image,
                    keywords: seo.keywords,
                    audience: field.audience,
                }}
                domain={host}
            />
            <SchemaScript type="FAQPage" data={{ questions: faqQuestions }} domain={host} />
            <article className="bg-slate-50 text-slate-900">
                <section className="bg-white">
                    <div className="container mx-auto px-4 py-6 md:px-6">
                        <Link
                            href="/linh-vuc-dao-tao"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#cc0022]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại lĩnh vực đào tạo
                        </Link>
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#00008b] py-16 text-white md:py-20">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <div>
                            <div className="mb-5 flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300 ring-1 ring-white/20">
                                    {field.group}
                                </span>
                                <span className="rounded-full bg-[#cc0022] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                                    {field.badge}
                                </span>
                            </div>
                            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                                {field.title}
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
                                {field.intro}
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={TRAINING_CONTACT_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-full bg-[#cc0022] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-red-700"
                                >
                                    Nhận tư vấn lộ trình
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Link
                                    href="/linh-vuc-dao-tao"
                                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-[#00008b]"
                                >
                                    Xem tất cả chương trình
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/10 shadow-2xl ring-1 ring-white/20">
                                <Image
                                    src={field.image}
                                    alt={field.imageAlt}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 560px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#00008b]/35 to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-16 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <InfoList
                            title="Nội dung cốt lõi"
                            icon={<BookOpen className="h-5 w-5" />}
                            items={field.highlights}
                        />
                        <InfoList
                            title="Kết quả sau khóa"
                            icon={<Target className="h-5 w-5" />}
                            items={field.outcomes}
                        />
                        <InfoList
                            title="Phù hợp với"
                            icon={<Users className="h-5 w-5" />}
                            items={field.audience}
                        />
                    </div>
                </section>

                <section className="bg-white py-16">
                    <div className="container mx-auto grid gap-10 px-4 md:px-6 lg:grid-cols-[0.85fr_1.15fr]">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#cc0022]">
                                Lộ trình học
                            </span>
                            <h2 className="mt-3 text-3xl font-black text-[#00008b] md:text-4xl">
                                Học đúng trọng tâm, nhìn thấy tiến bộ qua từng giai đoạn
                            </h2>
                            <p className="mt-5 text-base leading-8 text-slate-600">
                                Nội dung được thiết kế theo hướng thực hành, có kiểm tra đầu vào, theo dõi tiến bộ và điều chỉnh bài tập theo năng lực thực tế của học viên.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {field.curriculum.map((item, index) => (
                                <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00008b] text-sm font-black text-white">
                                        {index + 1}
                                    </div>
                                    <p className="pt-2 text-base font-semibold leading-7 text-slate-800">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-16 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <div className="rounded-3xl bg-[#00008b] p-8 text-white shadow-xl md:p-10">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                <Award className="h-6 w-6 text-yellow-300" />
                            </div>
                            <h2 className="text-2xl font-black">Đánh giá & chuẩn đầu ra</h2>
                            <p className="mt-4 text-base leading-8 text-blue-100">{field.assessment}</p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#cc0022]">
                                <Layers className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950">Tư vấn chương trình phù hợp</h2>
                            <p className="mt-4 text-base leading-8 text-slate-600">
                                Nếu học viên chưa chắc nên bắt đầu từ chứng chỉ, lập trình, AI hay Robotics, ERG sẽ đánh giá mục tiêu học tập và đề xuất lộ trình phù hợp nhất.
                            </p>
                            <Link
                                href={TRAINING_CONTACT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center rounded-full bg-[#cc0022] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-700"
                            >
                                Liên hệ ERG
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </article>
        </>
    );
}
