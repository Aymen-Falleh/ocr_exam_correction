'use client';

import { useTranslations } from 'next-intl';
import { FileDropzone } from '@/components/upload/file-dropzone';
import { UploadGuidelines } from '@/components/upload/upload-guidelines';

export default function UploadPage() {
    const t = useTranslations('Dashboard');

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {t('uploadTitle')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    {t('uploadDesc')}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <FileDropzone />

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl p-6">
                        <h4 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-2">
                            {t('privacyNotice')}
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400/80 leading-relaxed">
                            {t('privacyDesc')}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <UploadGuidelines />

                    <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl p-6 text-white dark:text-zinc-900 shadow-xl">
                        <h4 className="font-bold mb-2">{t('needHelp')}</h4>
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4 leading-relaxed">
                            {t('helpDesc')}
                        </p>
                        <button className="text-sm font-bold underline hover:text-blue-400 dark:hover:text-blue-600 transition-colors">
                            {t('contactTech')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
