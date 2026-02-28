import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    className?: string;
    color?: 'blue' | 'green' | 'purple' | 'amber';
}

const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
};

export function StatCard({ label, value, description, icon: Icon, trend, color = 'blue' }: StatCardProps) {
    return (
        <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                        <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">{value}</h3>
                    </div>
                    <div className={cn('p-3 rounded-xl transition-colors', colorMap[color])}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    {trend && (
                        <span className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded-full',
                            trend.isUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}>
                            {trend.isUp ? '+' : '-'}{trend.value}%
                        </span>
                    )}
                    <p className="text-xs text-zinc-400">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}
