import { useTranslations } from 'next-intl';
import { Info, Check, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function UploadGuidelines() {
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    {t('scanningGuidelines')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('guidelinesIntro')}
                </p>

                <ul className="space-y-3">
                    <li className="flex gap-3 text-sm">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{t('dpiGuideline')}</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{t('flatGuideline')}</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{t('lightGuideline')}</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{t('inkGuideline')}</span>
                    </li>
                </ul>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <h5 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">{t('supportedLanguages')}</h5>
                    <div className="flex flex-wrap gap-2">
                        {[tCommon('arabic'), tCommon('english'), tCommon('french')].map((lang) => (
                            <span key={lang} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
