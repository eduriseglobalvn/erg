"use client"

import { useState } from 'react'
import { Button } from '@/components/cms/ui/button'
import { JobApplicationModal } from '@/components/recruitment/job-application-modal'
import { Job } from '@/types/recruitment'
import { Send } from 'lucide-react'

export function JobDetailClient({ job, isSidebar = false }: { job: Job, isSidebar?: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                size={isSidebar ? "default" : "lg"}
                className={`font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all
                    ${isSidebar ? 'w-full bg-white text-blue-900 hover:bg-white/90' : 'bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]'}
                `}
                onClick={() => setIsModalOpen(true)}
            >
                <Send className="w-4 h-4 mr-2" />
                Ứng Tuyển Ngay
            </Button>

            <JobApplicationModal
                jobId={job.id}
                jobTitle={job.title}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
