import React from 'react';
import { Metadata } from 'next';
import { recruitmentApi } from '@/services/recruitment.api';
import ApplyForm from '@/components/features/recruitment/apply-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/utils/seo/page-metadata';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        const job = res.data;
        return createPageMetadata({
            title: `Ứng tuyển: ${job.title} | ERG Careers`,
            description: `Nộp hồ sơ ứng tuyển vị trí ${job.title} tại Edurise Global.`,
            path: `/tuyen-dung/${slug}/ung-tuyen`,
            imageAlt: `${job.title} application at ERG`,
            robots: { index: false, follow: true },
        });
    } catch {
        return createPageMetadata({
            title: 'Ứng tuyển | ERG Careers',
            description: 'Nộp hồ sơ ứng tuyển tại Edurise Global.',
            path: `/tuyen-dung/${slug}/ung-tuyen`,
            imageAlt: 'ERG Careers application',
            robots: { index: false, follow: true },
        });
    }
}

export default async function ApplyPage({ params }: Props) {
    const { slug } = await params;

    let job;
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        job = res.data;
    } catch (error) {
        console.error('Fetch job error:', error);
    }

    if (!job) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-[70px] lg:pt-[135px] pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto mb-8">
                    <Link
                        href={`/tuyen-dung/${job.slug}`}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#00008b] font-bold transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại chi tiết công việc
                    </Link>
                </div>

                <div className="max-w-3xl mx-auto">
                    <ApplyForm job={job} />
                </div>
            </div>
        </main>
    );
}
