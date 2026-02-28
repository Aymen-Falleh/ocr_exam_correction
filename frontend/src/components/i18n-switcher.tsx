'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages, Check } from 'lucide-react';
import { useParams } from 'next/navigation';

export function LanguageSwitcher() {
    const t = useTranslations('Common');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    function onLocaleChange(newLocale: string) {
        router.replace(
            // @ts-expect-error -- pathname and params are handled by next-intl/navigation
            { pathname, params },
            { locale: newLocale }
        );
    }

    const languages = [
        { code: 'en', label: t('english') },
        { code: 'fr', label: t('french') },
        { code: 'ar', label: t('arabic') },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-zinc-200 dark:border-zinc-800">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => onLocaleChange(lang.code)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        {lang.label}
                        {locale === lang.code && <Check className="h-4 w-4 text-blue-500" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
