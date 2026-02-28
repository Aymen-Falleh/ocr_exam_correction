'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { OCRResultViewer } from '@/components/dashboard/ocr-result-viewer';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    Share2,
    Printer,
    ChevronRight,
    ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import { useJob } from '@/hooks/use-job';

export default function JobDetailPage() {
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');
    const format = useFormatter();
    const { id } = useParams();
    const router = useRouter();

    const { data: job, isLoading } = useJob(id as string);

    if (!id) return null;
    if (isLoading) return <div className="h-96 flex items-center justify-center">Loading...</div>;
    if (!job) return <div className="h-96 flex items-center justify-center text-red-500">Job not found</div>;

    return (
        <div className="space-y-8 animate-in shadow-sm duration-500">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div className="flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="w-fit -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t('backToJobs')}
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {t('examBatch')}: <span className="text-blue-600 font-mono">{job.id}</span>
                            </h1>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {job.status}
                            </div>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                            {t('studentId')}: {job.studentId} • {t('date')}: {format.dateTime(new Date(job.uploadedAt), { year: 'numeric', month: 'short', day: 'numeric' })} • {t('language')}: {job.language}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-11 border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <Printer className="mr-2 h-4 w-4" />
                        {t('printResult')}
                    </Button>
                    <Button variant="outline" className="rounded-xl h-11 border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        {t('share')}
                    </Button>
                </div>
            </div>

            <OCRResultViewer jobId={id as string} />

            {/* Pagination between jobs */}
            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-12">
                <Button variant="ghost" className="text-zinc-500 hover:text-zinc-900 h-12 px-6">
                    <ChevronLeftIcon className="mr-4 h-5 w-5" />
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">{t('previousJob')}</span>
                        <span className="font-bold text-left">JOB-283</span>
                    </div>
                </Button>
                <Button variant="ghost" className="text-zinc-500 hover:text-zinc-900 h-12 px-6">
                    <div className="flex flex-col items-end text-right">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">{t('nextJob')}</span>
                        <span className="font-bold text-right">JOB-285</span>
                    </div>
                    <ChevronRight className="ml-4 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
