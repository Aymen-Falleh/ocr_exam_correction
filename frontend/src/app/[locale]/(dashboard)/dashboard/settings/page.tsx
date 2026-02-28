'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Globe,
    Bell,
    Shield,
    Save,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const t = useTranslations('Dashboard');
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {t('settingsTitle')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    {t('settingsDesc')}
                </p>
            </div>

            {/* Profile Settings */}
            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle>{t('profileSettings')}</CardTitle>
                            <CardDescription>{t('profileSettingsDesc')}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="settingsName">{t('fullName')}</Label>
                            <Input
                                id="settingsName"
                                value={profile.full_name}
                                onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="settingsEmail">{t('emailLabel')}</Label>
                            <Input
                                id="settingsEmail"
                                type="email"
                                value={profile.email}
                                disabled
                                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Label>{t('roleLabel')}</Label>
                        <Badge variant="secondary" className="rounded-md">
                            <Shield className="h-3 w-3 mr-1" />
                            {user?.role === 'admin' ? t('roleAdmin') : t('roleTeacher')}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* OCR Preferences */}
            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle>{t('ocrPreferences')}</CardTitle>
                            <CardDescription>{t('ocrPreferencesDesc')}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t('defaultLanguage')}</Label>
                        <div className="flex gap-2">
                            {['ar', 'en', 'fr'].map(lang => (
                                <Button
                                    key={lang}
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'rounded-lg px-4',
                                        lang === 'ar' && 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                    )}
                                >
                                    {lang.toUpperCase()}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t('confidenceThreshold')}</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                defaultValue={80}
                                min={50}
                                max={100}
                                className="h-11 rounded-xl w-24"
                            />
                            <span className="text-sm text-zinc-500">%</span>
                        </div>
                        <p className="text-xs text-zinc-400">{t('thresholdDesc')}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <CardTitle>{t('notifications')}</CardTitle>
                            <CardDescription>{t('notificationsDesc')}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[
                        { key: 'notifyComplete', label: t('notifyComplete') },
                        { key: 'notifyFailed', label: t('notifyFailed') },
                        { key: 'notifyLowConfidence', label: t('notifyLowConfidence') },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl">
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-blue-600" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    className={cn(
                        'rounded-xl h-11 px-8 shadow-lg transition-all',
                        saved
                            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    )}
                    onClick={handleSave}
                >
                    {saved ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t('saved')}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {t('saveSettings')}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
