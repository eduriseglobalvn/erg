import React from 'react';
import { Metadata } from 'next';
import { getJobDetailBySlug, EMPLOYER_INFO } from '@/mocks/jobs.mock';
import { recruitmentApi } from '@/services/recruitment.api';
import JobDetailContent from '@/components/tuyendung/JobDetailContent';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

import { notFound, permanentRedirect, redirect } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    let job;
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        job = res.data;
    } catch (e) {
        // Fallback
    }

    if (!job) {
        return {
            title: 'Không tìm thấy công việc',
        };
    }

    return {
        title: job.title,
        description: job.summary,
        openGraph: {
            title: `${job.title} | Tuyển dụng ERG`,
            description: job.summary,
            type: 'article',
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    let job;
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        job = res.data;
    } catch (e) {
        // Fallback
    }

    const headerList = await headers();
    const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

    if (!job) {
        // [SEO] Redirect về danh sách tuyển dụng
        redirect('/tuyen-dung?reason=not-found');
    }

    const breadcrumbItems = generateBreadcrumbItems(`/tuyen-dung/${slug}`, job.title, 'ERG');

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <SchemaScript
                type="JobPosting"
                data={{
                    title: job.title,
                    description: (job.description || []).join(' '),
                    datePosted: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    validThrough: job.deadline ? (job.deadline.includes('/') ? job.deadline.split('/').reverse().join('-') : job.deadline) : '',
                    employmentType: 'FULL_TIME',
                    hiringOrganization: {
                        name: EMPLOYER_INFO.name,
                        sameAs: 'https://erg.edu.vn'
                    },
                    jobLocation: {
                        address: {
                            addressLocality: job.location,
                            addressCountry: 'VN'
                        }
                    },
                    baseSalary: {
                        currency: 'VND',
                        value: 0, // Thỏa thuận
                        repeatFrequency: 'MONTH'
                    }
                }}
                domain={host}
            />
            <JobDetailContent job={job} employer={EMPLOYER_INFO} />
        </>
    );
}