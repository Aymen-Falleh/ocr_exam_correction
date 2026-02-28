'use client';

import {
    Bell,
    Search,
    Menu,
    ChevronDown,
    User as UserIcon,
    ShieldCheck,
    Languages
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/i18n-switcher';
import { useTranslations } from 'next-intl';

export function Topbar() {
    const { user, logout } = useAuth();
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');

    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-zinc-700 lg:hidden" aria-label="Open sidebar">
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        {t('searchPlaceholder')}
                    </label>
                    <Search
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-zinc-400"
                        aria-hidden="true"
                    />
                    <Input
                        id="search-field"
                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:ring-0 sm:text-sm bg-transparent"
                        placeholder={t('searchPlaceholder')}
                        type="search"
                        name="search"
                    />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <LanguageSwitcher />

                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-500 relative" aria-label="View notifications">
                        <Bell className="h-6 w-6" aria-hidden="true" />
                        <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-950" />
                    </Button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 lg:dark:bg-zinc-800" aria-hidden="true" />

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="-m-1.5 flex items-center p-1.5 group" aria-label="Open user menu">
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 group-hover:border-blue-500 transition-colors">
                                    <UserIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                </div>
                                <span className="hidden lg:flex lg:items-center">
                                    <span className="mx-4 text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50" aria-hidden="true">
                                        {user?.full_name || user?.email || '...'}
                                    </span>
                                    <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" aria-hidden="true" />
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 border-zinc-200 dark:border-zinc-800" align="end">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span>{tCommon('profileSettings')}</span>
                                    <span className="text-xs font-normal text-zinc-500 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3 text-blue-500" />
                                        {user?.role}
                                    </span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">{tCommon('profileSettings')}</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">{tCommon('userManagement')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => logout()}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
                            >
                                {tCommon('logout')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
