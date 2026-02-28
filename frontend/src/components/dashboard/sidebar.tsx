'use client';

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Upload,
    FileText,
    Settings,
    Users,
    BarChart3,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';

export function Sidebar() {
    const t = useTranslations('Common');
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();

    const navigation = [
        { name: t('dashboard'), key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: t('upload'), key: 'upload', href: '/dashboard/upload', icon: Upload },
        { name: t('jobs'), key: 'jobs', href: '/dashboard/jobs', icon: FileText },
        { name: t('analytics'), key: 'analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: t('users'), key: 'users', href: '/dashboard/users', icon: Users, role: 'admin' },
    ];

    const secondaryNavigation = [
        { name: t('settings'), key: 'settings', href: '/dashboard/settings', icon: Settings },
        { name: t('help'), key: 'help', href: '/dashboard/help', icon: HelpCircle },
    ];

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                        <span className="text-white font-bold">OCR</span>
                    </div>
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">ExamPortal</span>
                </div>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                                if (item.role && user?.role !== item.role) return null;
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.key}>
                                        <Link
                                            href={item.href as any}
                                            className={cn(
                                                isActive
                                                    ? 'bg-zinc-50 dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                                                    : 'text-zinc-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-900',
                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-all duration-200'
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
                                                    'h-5 w-5 shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>

                    <li className="mt-auto">
                        <ul role="list" className="-mx-2 space-y-1">
                            {secondaryNavigation.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.href as any}
                                        className={cn(
                                            pathname === item.href
                                                ? 'bg-zinc-50 dark:bg-zinc-900 text-blue-600 dark:text-blue-400'
                                                : 'text-zinc-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-900',
                                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-all duration-200'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
                                                'h-5 w-5 shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={logout}
                                    className="w-full text-zinc-700 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-all duration-200"
                                >
                                    <LogOut
                                        className="h-5 w-5 shrink-0 text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400"
                                        aria-hidden="true"
                                    />
                                    {t('logout')}
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>

    );
}
