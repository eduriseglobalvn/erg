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

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: field.link,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            type: 'website',
            title: seo.title,
            description: seo.description,
            url: field.link,
            images: [{ url: field.image, alt: field.imageAlt, width: 1200, height: 630 }]
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
            images: [field.image],
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
