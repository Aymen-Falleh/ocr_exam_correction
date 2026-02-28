'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type Language = 'Arabic' | 'English' | 'French';

export interface OCRJob {
    id: string;
    studentId: string;
    studentName: string;
    language: Language;
    status: JobStatus;
    confidence: number;
    uploadedAt: string;
}

interface FetchJobsParams {
    page: number;
    limit: number;
    status?: JobStatus;
    language?: Language;
    search?: string;
}

const MOCK_DATA: OCRJob[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `JOB-${1000 + i}`,
    studentId: `STU-${5000 + i}`,
    studentName: `Student ${i + 1}`,
    language: i % 3 === 0 ? 'Arabic' : i % 3 === 1 ? 'English' : 'French',
    status: i % 5 === 0 ? 'PROCESSING' : i % 7 === 0 ? 'FAILED' : 'COMPLETED',
    confidence: Math.floor(Math.random() * (100 - 85 + 1)) + 85,
    uploadedAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

import api from '@/lib/axios';

export function useJobs(params: FetchJobsParams) {
    const { page, limit, status, language, search } = params;

    return useQuery({
        queryKey: ['jobs', page, limit, status, language, search],
        queryFn: async () => {
            const response = await api.get('/jobs/', {
                params: {
                    skip: (page - 1) * limit,
                    limit: limit,
                    status: status
                }
            });

            const jobs = response.data.map((job: any) => ({
                id: job.id.toString(),
                studentId: "N/A", // Backend doesn't have studentId yet in model
                studentName: job.filename,
                language: job.language,
                status: job.status.toUpperCase(),
                confidence: job.avg_confidence ? Math.round(job.avg_confidence * 100) : 0,
                uploadedAt: job.created_at,
            }));

            return {
                data: jobs,
                total: jobs.length, // Simple mock for total count
                totalPages: Math.ceil(jobs.length / limit),
            };
        },
        refetchInterval: (query: any) => {
            const data = query.state.data;
            const hasProcessing = data?.data?.some((j: any) => j.status === 'PROCESSING' || j.status === 'PENDING');
            return hasProcessing ? 3000 : false;
        }
    });
}
