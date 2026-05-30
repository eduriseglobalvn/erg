import React from 'react';
import { Metadata } from 'next';
import { EMPLOYER_INFO } from '@/mocks/jobs.mock';
import { recruitmentApi } from '@/services/recruitment.api';
import JobDetailContent from '@/components/tuyendung/JobDetailContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { buildSeoKeywords } from '@/utils/seo/keywords';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const headerList = await headers();
    const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

    let job;
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        job = res.data;
    } catch {
        // Fallback
    }

    if (!job) {
        return {
            title: 'Không tìm thấy công việc',
        };
    }

    return generateFullMetadata({
        title: job.title,
        description: job.summary,
        keywords: buildSeoKeywords({
            title: job.title,
            description: job.summary,
            sections: [
                job.location,
                job.workType,
                ...(job.description || []),
                ...(job.requirements || []),
                ...(job.benefits || []),
            ],
            seedKeywords: ['ERG tuyển dụng', 'việc làm ERG', job.title],
        }),
        path: `/tuyen-dung/${slug}`,
        host,
        type: 'website',
    });
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    let job;
    try {
        const res = await recruitmentApi.getJobBySlug(slug);
        job = res.data;
    } catch {
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
                    datePosted: job.postDate ? job.postDate.split('/').reverse().join('-') : (job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
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
                    ...(job.baseSalary && job.baseSalary > 0 && {
                        baseSalary: {
                            currency: 'VND',
                            value: job.baseSalary,
                            repeatFrequency: 'MONTH'
                        }
                    })
                }}
                domain={host}
            />
            <JobDetailContent job={job} employer={EMPLOYER_INFO} />
        </>
    );
}
