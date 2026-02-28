'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { OCRJob, JobStatus } from './use-jobs';

interface JobDetail extends OCRJob {
    extractions: Array<{
        id: number;
        question_text: string;
        answer_text: string;
        confidence: number;
        bounding_box: any;
    }>;
}

export function useJob(id: string) {
    return useQuery({
        queryKey: ['job', id],
        queryFn: async () => {
            const response = await api.get(`/jobs/${id}`);
            const job = response.data;

            return {
                id: job.id.toString(),
                studentId: "N/A",
                studentName: job.filename,
                language: job.language,
                status: job.status.toUpperCase() as JobStatus,
                confidence: job.avg_confidence ? Math.round(job.avg_confidence * 100) : 0,
                uploadedAt: job.created_at,
                extractions: job.extractions
            };
        },
        refetchInterval: (query) => {
            const data = query.state.data as any;
            return (data?.status === 'PROCESSING' || data?.status === 'PENDING') ? 3000 : false;
        }
    });
}
