import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { recruitmentApi } from '@/services/recruitment.api';
import { JobDetailClient } from './client'; // Client component for interactivity
import { Briefcase, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';

export const revalidate = 60;

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let job;

    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        job = res.data;
    } catch (e) {
        // Fallback or ignore
    }

    if (!job) {
        // [SEO] Redirect về trang tuyển dụng kèm thông báo
        redirect('/tuyen-dung?reason=not-found');
    }

    // Helper to render lists
    const renderList = (items: string[]) => (
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </ul>
    );

    return (
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
    );
}
