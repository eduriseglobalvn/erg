import Link from 'next/link';
import { Button } from '@/components/cms/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/cms/ui/card';
import { recruitmentApi } from '@/services/recruitment.api';
import { Job } from '@/types/recruitment';
import { Briefcase, MapPin, ArrowRight, Flame, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RecruitmentPage() {
    let jobs: Job[] = [];
    try {
        const res = await recruitmentApi.getJobs();
        jobs = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    } catch (e) {
        console.error("Failed to fetch jobs", e);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Cơ Hội Nghề Nghiệp Tại ERG</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Hãy gia nhập đội ngũ ERG để cùng nhau kiến tạo tương lai giáo dục và công nghệ.
                        Chúng tôi luôn chào đón những tài năng đam mê và nhiệt huyết.
                    </p>
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">Hiện tại chưa có vị trí tuyển dụng nào đang mở.</p>
                        <p className="text-sm text-gray-400 mt-2">Vui lòng quay lại sau nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-transparent hover:border-t-blue-600 flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-1 flex-wrap">
                                            {job.isHot && (
                                                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-red-100 text-red-600 flex items-center gap-1">
                                                    <Flame className="w-3 h-3" /> HOT
                                                </span>
                                            )}
                                            {job.isUrgent && (
                                                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-yellow-100 text-yellow-700 flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> GẤP
                                                </span>
                                            )}
                                            {job.isNew && (
                                                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-100 text-blue-600">
                                                    MỚI
                                                </span>
                                            )}
                                            {!job.isHot && !job.isUrgent && !job.isNew && (
                                                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">
                                                    {job.workSchedule || job.workType}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">{job.location}</span>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[56px]" title={job.title}>
                                        {job.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <MapPin className="w-4 h-4" /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-semibold text-green-600">
                                        <Briefcase className="w-4 h-4 text-gray-400" /> {job.salary}
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                        {job.summary}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold group">
                                        <Link href={`/tuyen-dung/${job.slug}`}>
                                            Xem Chi Tiết <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
