import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { JobsTable } from '@/components/dashboard/jobs-table';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Plus } from 'lucide-react';

export default function JobsPage() {
    const t = useTranslations('Dashboard');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {t('jobsTitle')}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        {t('jobsDesc')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 rounded-xl gap-2 border-zinc-200 dark:border-zinc-800">
                        <Download className="h-4 w-4" />
                        {t('exportCsv')}
                    </Button>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 shadow-lg shadow-blue-500/20">
                        <Link href="/dashboard/upload">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('newBatch')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <JobsTable />
            </div>

            <div className="bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-900">
                        <FileSpreadsheet className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t('advancedReporting')}</h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('advancedReportingDesc')}</p>
                    </div>
                </div>
                <Button variant="secondary" className="rounded-lg h-10 px-6">
                    {t('accessReportBuilder')}
                </Button>
            </div>
        </div>
    );
}
