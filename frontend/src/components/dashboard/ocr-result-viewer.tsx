'use client';

import {
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Download,
    FileText,
    Scan,
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OCRResultViewerProps {
    jobId: string;
}

import { useTranslations } from 'next-intl';

import { useJob } from '@/hooks/use-job';

export function OCRResultViewer({ jobId }: OCRResultViewerProps) {
    const t = useTranslations('Dashboard');
    const tCommon = useTranslations('Common');

    const { data: job, isLoading } = useJob(jobId);

    if (isLoading) return <div className="animate-pulse space-y-4">...</div>;
    if (!job) return <div>No data found</div>;

    const extractions = job.extractions || [];

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Visual Overlay Placeholder */}
            <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950 flex flex-col min-h-[600px]">
                <CardHeader className="bg-zinc-900 border-b border-zinc-800 text-white flex flex-row items-center justify-between py-4">
                    <div>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Scan className="h-4 w-4 text-blue-400" />
                            {t('originalScan')}
                        </CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 relative p-0 bg-zinc-100 dark:bg-zinc-900 overflow-hidden group">
                    {/* Simulated Scan with Bounding Boxes */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
                        <span className="text-8xl font-black rotate-12 uppercase">{t('examBatch')}</span>
                    </div>

                    {/* Mock Bounding Boxes */}
                    <div className="absolute top-20 left-12 w-64 h-24 border-2 border-green-500 bg-green-500/10 rounded group-hover:bg-green-500/20 transition-all cursor-crosshair">
                        <span className="absolute -top-6 left-0 bg-green-500 text-white text-[10px] px-1 font-bold rounded">{t('questionLabel')} 1 [98%]</span>
                    </div>

                    <div className="absolute top-52 left-12 w-32 h-12 border-2 border-green-500 bg-green-500/10 rounded group-hover:bg-green-500/20 transition-all cursor-crosshair">
                        <span className="absolute -top-6 left-0 bg-green-500 text-white text-[10px] px-1 font-bold rounded">{t('questionLabel')} 2 [99%]</span>
                    </div>

                    <div className="absolute top-72 left-12 w-72 h-32 border-2 border-amber-500 bg-amber-500/10 rounded group-hover:bg-amber-500/20 transition-all cursor-crosshair">
                        <span className="absolute -top-6 left-0 bg-amber-500 text-white text-[10px] px-1 font-bold rounded">{t('questionLabel')} 3 [82%]</span>
                    </div>

                    <div className="absolute top-[420px] left-12 w-60 h-24 border-2 border-red-500 bg-red-500/10 rounded group-hover:bg-red-500/20 transition-all cursor-crosshair animate-pulse">
                        <span className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1 font-bold rounded">{t('questionLabel')} 5 [74%] {t('lowConfidence')}</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                        <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur rounded-full px-4 py-2 border border-zinc-700 shadow-2xl">
                            <Button size="sm" variant="ghost" className="text-white hover:text-blue-400">{t('zoomOut')}</Button>
                            <span className="text-white text-xs font-mono">100%</span>
                            <Button size="sm" variant="ghost" className="text-white hover:text-blue-400">{t('zoomIn')}</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Structured Results */}
            <div className="space-y-6">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{t('extractedData')}</CardTitle>
                            <Badge variant="outline" className="border-zinc-200 dark:border-zinc-700">{t('languageMix')}</Badge>
                        </div>
                        <CardDescription>{t('verifiedBy')} v4.2</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <TableHead>{t('fieldQuestion')}</TableHead>
                                    <TableHead>{t('confidenceScore')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {extractions.map((item: any, idx: number) => (
                                    <TableRow key={idx} className="group cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                    {t('questionLabel')} {idx + 1}
                                                </p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.answer_text}</p>
                                                <p className="text-xs text-zinc-500 italic">"{item.question_text}"</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-sm font-bold",
                                                    item.confidence > 0.9 ? 'text-green-600' : item.confidence > 0.8 ? 'text-amber-600' : 'text-red-600'
                                                )}>
                                                    {Math.round(item.confidence * 100)}%
                                                </span>
                                                {item.confidence < 0.8 && <AlertCircle className="h-4 w-4 text-red-500" />}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-zinc-400" />
                            {t('ocrMetadata')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">{t('processTime')}</p>
                            <p className="text-sm font-semibold">1.4 seconds</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">{t('engine')}</p>
                            <p className="text-sm font-semibold">VisionNet-A1</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">{t('inputFormat')}</p>
                            <p className="text-sm font-semibold">PDF (300 DPI)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">{t('integrityHash')}</p>
                            <p className="text-xs font-mono text-zinc-500">sha256:4a9c...1b2d</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 h-10 rounded-xl font-bold">
                        {t('flagReview')}
                    </Button>
                    <Button variant="outline" className="flex-1 h-10 rounded-xl font-bold">
                        {t('exportJson')}
                    </Button>
                </div>
            </div>
        </div>

    );
}
