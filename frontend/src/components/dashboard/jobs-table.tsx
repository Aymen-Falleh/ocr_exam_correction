'use client';

import { useState } from 'react';
import { useJobs, type JobStatus, type Language } from '@/hooks/use-jobs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    MoreVertical,
    Download,
    Eye,
    Trash2,
    Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { useTranslations, useFormatter } from 'next-intl';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export function JobsTable() {
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');
    const format = useFormatter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<JobStatus | undefined>();
    const [language, setLanguage] = useState<Language | undefined>();
    const limit = 10;

    const { data, isLoading } = useJobs({
        page,
        limit,
        search,
        status,
        language,
    });

    const statusColors = {
        COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        PROCESSING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        PENDING: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    };

    const statusLabels = {
        COMPLETED: t('completed_status'),
        PROCESSING: t('processing_status'),
        FAILED: t('failed_status'),
        PENDING: t('pending_status'),
    };

    const languageLabels = {
        Arabic: tCommon('arabic'),
        English: tCommon('english'),
        French: tCommon('french'),
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder={t('searchPlaceholder')}
                        className="pl-10 h-10 rounded-lg border-zinc-200 dark:border-zinc-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 rounded-lg gap-2">
                                <Filter className="h-4 w-4" />
                                {status ? statusLabels[status] : t('allStatuses')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setStatus(undefined)}>{t('allStatuses')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatus('COMPLETED')}>{t('completed_status')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatus('PROCESSING')}>{t('processing_status')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatus('FAILED')}>{t('failed_status')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 rounded-lg gap-2">
                                <Languages className="h-4 w-4" />
                                {language ? languageLabels[language] : t('allLanguages')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLanguage(undefined)}>{t('allLanguages')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('Arabic')}>{tCommon('arabic')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('English')}>{tCommon('english')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('French')}>{tCommon('french')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/30">
                            <TableHead className="w-[120px]">{t('jobId')}</TableHead>
                            <TableHead>{t('student')}</TableHead>
                            <TableHead>{t('language')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead>{t('confidenceScore')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead className="text-right">{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data?.data?.map((job: any) => (
                            <TableRow key={job.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                                <TableCell className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {job.id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{job.studentName}</span>
                                        <span className="text-xs text-zinc-500">{job.studentId}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{languageLabels[job.language as keyof typeof languageLabels]}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("shadow-none border-none px-2 py-0.5", statusColors[job.status as keyof typeof statusColors])}>
                                        {statusLabels[job.status as keyof typeof statusLabels]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">{job.confidence}%</span>
                                        <div className="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full",
                                                    job.confidence > 90 ? 'bg-green-500' : job.confidence > 80 ? 'bg-amber-500' : 'bg-red-500'
                                                )}
                                                style={{ width: `${job.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-zinc-500">
                                        {format.dateTime(new Date(job.uploadedAt), {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric'
                                        })}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2">
                                                <Eye className="h-4 w-4" /> {t('viewDetails')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Download className="h-4 w-4" /> {t('exportResult')}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                                                <Trash2 className="h-4 w-4" /> {t('deleteJob')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-800/20">
                    <p className="text-xs text-zinc-500">
                        {t('showing')} <span className="font-bold text-zinc-900 dark:text-zinc-50">{(page - 1) * limit + 1}-{Math.min(page * limit, data?.total || 0)}</span> {t('of')} <span className="font-bold text-zinc-900 dark:text-zinc-50">{data?.total || 0}</span> {t('jobs')}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1 || isLoading}
                            onClick={() => setPage(prev => prev - 1)}
                            className="h-8 w-8 p-0 rounded-lg"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs font-bold px-2">{page}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === data?.totalPages || isLoading}
                            onClick={() => setPage(prev => prev + 1)}
                            className="h-8 w-8 p-0 rounded-lg"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}
