'use client';

import {
    FileCheck,
    Clock,
    CheckCircle2,
    Target,
    BarChart2,
    ArrowUpRight,
    Plus
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {t('welcome')}, Administrator
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        {t('overview')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20">
                        <Link href="/dashboard/upload">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('upload')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label={t('totalExams')}
                    value="1,284"
                    description={t('totalExamsDesc')}
                    icon={FileCheck}
                    trend={{ value: 12, isUp: true }}
                    color="blue"
                />
                <StatCard
                    label={t('processing')}
                    value="24"
                    description={t('processingDesc')}
                    icon={Clock}
                    color="amber"
                />
                <StatCard
                    label={t('completed')}
                    value="1,245"
                    description={t('completedDesc')}
                    icon={CheckCircle2}
                    trend={{ value: 8, isUp: true }}
                    color="green"
                />
                <StatCard
                    label={t('confidence')}
                    value="94.2%"
                    description={t('confidenceDesc')}
                    icon={Target}
                    trend={{ value: 2, isUp: true }}
                    color="purple"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('performance')}</CardTitle>
                                <CardDescription>{t('performanceDesc')}</CardDescription>
                            </div>
                            <BarChart2 className="h-5 w-5 text-zinc-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                            <span className="text-sm text-zinc-400">Language distribution visualization placeholder</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('recentJobs')}</CardTitle>
                                <CardDescription>{t('recentJobsDesc')}</CardDescription>
                            </div>
                            <Link href="/dashboard/jobs" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                {t('viewAll')} <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { id: 'JOB-284', language: tCommon('arabic'), status: t('completed'), student: 'Student #4829', confidence: '98%' },
                                { id: 'JOB-283', language: tCommon('french'), status: t('completed'), student: 'Student #2938', confidence: '94%' },
                                { id: 'JOB-282', language: tCommon('arabic'), status: t('processing'), student: 'Student #1923', confidence: '-' },
                                { id: 'JOB-281', language: tCommon('english'), status: t('completed'), student: 'Student #5821', confidence: '92%' },
                                { id: 'JOB-280', language: tCommon('arabic'), status: t('completed'), student: 'Student #4721', confidence: '96%' },
                            ].map((job, idx) => (
                                <div key={job.id} className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        job.status === t('completed') ? 'bg-green-500' : 'bg-amber-500'
                                    )} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{job.id} - {job.student}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{job.language} • {job.status}</p>
                                    </div>
                                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {job.confidence}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
