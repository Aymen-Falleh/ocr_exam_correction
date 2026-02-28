'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    HelpCircle,
    BookOpen,
    MessageCircle,
    Mail,
    ExternalLink,
    ChevronDown,
    FileText,
    Upload,
    BarChart3,
    Shield,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FAQItem {
    question: string;
    answer: string;
    icon: any;
}

export default function HelpPage() {
    const t = useTranslations('Dashboard');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        { question: t('faqUploadQ'), answer: t('faqUploadA'), icon: Upload },
        { question: t('faqFormatsQ'), answer: t('faqFormatsA'), icon: FileText },
        { question: t('faqConfidenceQ'), answer: t('faqConfidenceA'), icon: BarChart3 },
        { question: t('faqLanguagesQ'), answer: t('faqLanguagesA'), icon: HelpCircle },
        { question: t('faqSecurityQ'), answer: t('faqSecurityA'), icon: Shield },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {t('helpTitle')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    {t('helpPageDesc')}
                </p>
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{t('documentation')}</h3>
                            <p className="text-xs text-zinc-500">{t('documentationDesc')}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                            <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{t('liveChat')}</h3>
                            <p className="text-xs text-zinc-500">{t('liveChatDesc')}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                            <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{t('emailSupport')}</h3>
                            <p className="text-xs text-zinc-500">{t('emailSupportDesc')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Section */}
            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-zinc-400" />
                        {t('faqTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <faq.icon className="h-4 w-4 text-zinc-400" />
                                    <span className="font-medium text-zinc-900 dark:text-zinc-50">{faq.question}</span>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        'h-4 w-4 text-zinc-400 transition-transform',
                                        openIndex === i && 'rotate-180'
                                    )}
                                />
                            </button>
                            {openIndex === i && (
                                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed ml-7">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Contact Banner */}
            <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-white dark:text-zinc-900 mb-2">{t('stillNeedHelp')}</h3>
                <p className="text-zinc-400 dark:text-zinc-500 mb-6 max-w-md mx-auto">{t('stillNeedHelpDesc')}</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-lg shadow-blue-500/20">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('contactSupport')}
                </Button>
            </div>
        </div>
    );
}
