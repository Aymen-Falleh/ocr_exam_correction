'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    TrendingUp,
    FileCheck,
    Clock,
    Target,
    Languages,
    Download,
    Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');

    const languageStats = [
        { lang: tCommon('arabic'), count: 842, pct: 65, color: 'bg-blue-500' },
        { lang: tCommon('english'), count: 285, pct: 22, color: 'bg-emerald-500' },
        { lang: tCommon('french'), count: 157, pct: 13, color: 'bg-amber-500' },
    ];

    const weeklyData = [
        { day: 'Mon', value: 42 },
        { day: 'Tue', value: 68 },
        { day: 'Wed', value: 55 },
        { day: 'Thu', value: 91 },
        { day: 'Fri', value: 73 },
        { day: 'Sat', value: 28 },
        { day: 'Sun', value: 15 },
    ];
    const maxWeekly = Math.max(...weeklyData.map(d => d.value));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {t('analyticsTitle')}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        {t('analyticsDesc')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 rounded-xl gap-2 border-zinc-200 dark:border-zinc-800">
                        <Calendar className="h-4 w-4" />
                        {t('last30Days')}
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl gap-2 border-zinc-200 dark:border-zinc-800">
                        <Download className="h-4 w-4" />
                        {t('exportReport')}
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label={t('totalProcessed')}
                    value="1,284"
                    description={t('last30Days')}
                    icon={FileCheck}
                    trend={{ value: 12, isUp: true }}
                    color="blue"
                />
                <StatCard
                    label={t('avgProcessTime')}
                    value="2.4s"
                    description={t('perDocument')}
                    icon={Clock}
                    trend={{ value: 15, isUp: true }}
                    color="amber"
                />
                <StatCard
                    label={t('avgConfidenceLabel')}
                    value="94.2%"
                    description={t('acrossAllLangs')}
                    icon={Target}
                    trend={{ value: 2, isUp: true }}
                    color="green"
                />
                <StatCard
                    label={t('successRate')}
                    value="98.1%"
                    description={t('completedVsFailed')}
                    icon={TrendingUp}
                    trend={{ value: 1, isUp: true }}
                    color="purple"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Weekly Processing Volume */}
                <Card className="lg:col-span-4 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('weeklyVolume')}</CardTitle>
                                <CardDescription>{t('weeklyVolumeDesc')}</CardDescription>
                            </div>
                            <BarChart3 className="h-5 w-5 text-zinc-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between gap-2 h-[250px] pt-4">
                            {weeklyData.map((item) => (
                                <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                                    <span className="text-xs font-semibold text-zinc-500">{item.value}</span>
                                    <div
                                        className="w-full bg-blue-500/80 rounded-t-lg transition-all hover:bg-blue-600"
                                        style={{ height: `${(item.value / maxWeekly) * 180}px` }}
                                    />
                                    <span className="text-xs text-zinc-400 font-medium">{item.day}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Language Distribution */}
                <Card className="lg:col-span-3 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('langDistribution')}</CardTitle>
                                <CardDescription>{t('langDistributionDesc')}</CardDescription>
                            </div>
                            <Languages className="h-5 w-5 text-zinc-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {languageStats.map((stat) => (
                            <div key={stat.lang} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{stat.lang}</span>
                                    <span className="text-sm text-zinc-500">{stat.count} ({stat.pct}%)</span>
                                </div>
                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn('h-full rounded-full transition-all', stat.color)}
                                        style={{ width: `${stat.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">{t('totalDocuments')}</span>
                                <span className="font-bold text-zinc-900 dark:text-zinc-50">1,284</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Confidence by Language */}
            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>{t('confidenceByLang')}</CardTitle>
                    <CardDescription>{t('confidenceByLangDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { lang: tCommon('arabic'), confidence: 92.4, trend: 1.5 },
                            { lang: tCommon('english'), confidence: 96.8, trend: 0.3 },
                            { lang: tCommon('french'), confidence: 93.1, trend: 2.1 },
                        ].map((item) => (
                            <div key={item.lang} className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.lang}</span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        +{item.trend}%
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                    {item.confidence}%
                                </div>
                                <div className="mt-2 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${item.confidence}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
