import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SchemaScript } from '@/components/seo/schema-script';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import { recruitmentApi } from '@/services/recruitment.api';
import { JobDetailClient } from './client'; // Client component for interactivity
import { Briefcase, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';

type Props = { params: Promise<{ slug: string }> };

async function getJob(slug: string) {
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        return res.data;
    } catch {
        return undefined;
    }
}

// Chỉ nhận định dạng dd/mm/yyyy hoặc yyyy-mm-dd; giá trị khác bỏ qua để không phát sinh ngày sai vào dữ liệu có cấu trúc.
function toIsoDate(value?: string) {
    if (!value) return undefined;
    const vn = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (vn) return `${vn[3]}-${vn[2].padStart(2, '0')}-${vn[1].padStart(2, '0')}`;
    return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : undefined;
}

function toEmploymentType(workType?: string) {
    if (!workType) return undefined;
    if (/toàn thời gian|full/i.test(workType)) return 'FULL_TIME';
    if (/bán thời gian|part/i.test(workType)) return 'PART_TIME';
    if (/thực tập|intern/i.test(workType)) return 'INTERN';
    return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const job = await getJob(slug);
    if (!job) return { title: 'Không tìm thấy vị trí tuyển dụng', robots: { index: false, follow: true } };

    const title = `${job.title} - Tuyển dụng | ERG`;
    const base = (job.summary || `Ứng tuyển vị trí ${job.title} tại ERG (Edurise Global)${job.location ? ` làm việc tại ${job.location}` : ''}.`).replace(/\s+/g, ' ').trim();
    const full = base.length < 110 ? `${base} Xem mô tả công việc, yêu cầu, quyền lợi và hạn nộp hồ sơ.` : base;
    const description = full.length > 160 ? `${full.slice(0, 157).replace(/\s+\S*$/, '')}...` : full;

    return {
        ...createPageMetadata({ title, description, path: `/tuyen-dung/${slug}`, imageAlt: `Tuyển dụng ${job.title} tại ERG` }),
        title: { absolute: title },
    };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const job = await getJob(slug);

    if (!job) {
        // [SEO] Redirect về trang tuyển dụng kèm thông báo
        redirect('/tuyen-dung?reason=not-found');
    }

    const host = (await headers()).get('host') || 'erg.edu.vn';
    const datePosted = toIsoDate(job.postDate) || toIsoDate(job.createdAt);
    const employmentType = toEmploymentType(job.workType);
    const jobDescription = (job.description || []).join(' ');
    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Tuyển dụng', href: '/tuyen-dung' },
        { label: job.title },
    ];

    // Helper to render lists
    const renderList = (items: string[]) => (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </ul>
    );

    return (
        <>
        <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
        {/* JobPosting chỉ phát khi có đủ ngày đăng, mô tả, địa điểm và loại hình làm việc thật từ dữ liệu tin tuyển dụng */}
        {datePosted && employmentType && jobDescription && job.location && (
            <SchemaScript
                type="JobPosting"
                data={{
                    title: job.title,
                    description: jobDescription,
                    postedAt: datePosted,
                    validThrough: toIsoDate(job.deadline),
                    type: employmentType,
                    location: job.location,
                }}
                domain={host}
            />
        )}
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
                                    <MapPin size={16} /> {job.location}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
                                    <DollarSign size={16} /> {job.salary}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                                    <Briefcase size={16} /> {job.workType}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full">
                                    <Calendar size={16} /> Hạn nộp: {job.deadline}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button Client Component */}
                        <div className="shrink-0">
                            <JobDetailClient job={job} />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
                                Mô tả công việc
                            </h2>
                            <div className="prose max-w-none text-gray-700 mb-8">
                                {renderList(job.description || [])}
                            </div>

                            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
                                Yêu cầu ứng viên
                            </h2>
                            <div className="prose max-w-none text-gray-700 mb-8">
                                {renderList(job.requirements || [])}
                            </div>

                            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
                                Quyền lợi
                            </h2>
                            <div className="prose max-w-none text-gray-700">
                                {renderList(job.benefits || [])}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-2xl p-6 text-white shadow-lg text-center">
                            <h3 className="text-lg font-bold mb-2">Bạn đã sẵn sàng?</h3>
                            <p className="text-blue-100 text-sm mb-6">Hãy gửi CV ngay để không bỏ lỡ cơ hội làm việc tại môi trường chuyên nghiệp.</p>
                            <JobDetailClient job={job} isSidebar />
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4">Địa điểm làm việc</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                <strong>Văn phòng ERG:</strong><br />
                                {job.location}
                            </p>
                            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                Google Map View
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
        </>
    );
}
