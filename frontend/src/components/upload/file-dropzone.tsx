'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import {
    Upload,
    File as FileIcon,
    X,
    CheckCircle2,
    AlertCircle,
    FileText,
    Loader2,
    Sparkles,
    Eye,
    ArrowRight,
    Zap,
    BarChart3,
    Languages,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios';

interface FileWithStatus {
    id: string;
    file: File;
    name: string;
    size: number;
    status: 'PENDING' | 'UPLOADING' | 'UPLOADED' | 'ERROR';
    progress: number;
    jobId?: number;
}

type OCRStatus = 'idle' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed';

interface JobResult {
    id: number;
    status: string;
    filename: string;
    avg_confidence: number | null;
    extractions: Array<{
        id: number;
        question_text: string;
        answer_text: string;
        confidence: number;
        bounding_box: any;
    }>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
};

export function FileDropzone() {
    const t = useTranslations('Dashboard');
    const router = useRouter();
    const [files, setFiles] = useState<FileWithStatus[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [ocrStatus, setOcrStatus] = useState<OCRStatus>('idle');
    const [ocrProgress, setOcrProgress] = useState(0);
    const [jobResults, setJobResults] = useState<JobResult[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('ar');
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (pollingInterval) clearInterval(pollingInterval);
        };
    }, [pollingInterval]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (ocrStatus === 'completed' || ocrStatus === 'processing') return;
        const newFiles: FileWithStatus[] = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            name: file.name,
            size: file.size,
            status: 'PENDING',
            progress: 0,
        }));
        setFiles(prev => [...prev, ...newFiles]);
        setOcrStatus('idle');
        setJobResults([]);
    }, [ocrStatus]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_FILE_SIZE,
        disabled: ocrStatus === 'processing' || ocrStatus === 'uploading',
    });

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setOcrStatus('uploading');

        for (const file of files) {
            if (file.status === 'UPLOADED') continue;
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'UPLOADING', progress: 0 } : f));

            try {
                const formData = new FormData();
                formData.append('file', file.file);
                formData.append('language', selectedLanguage);

                const response = await api.post('/jobs/upload', formData, {
                    onUploadProgress: (progressEvent: any) => {
                        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress } : f));
                    }
                });

                const jobId = response.data.id;
                setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'UPLOADED', progress: 100, jobId } : f));
            } catch (error) {
                console.error('Upload failed:', error);
                setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'ERROR' } : f));
            }
        }
        setIsUploading(false);
        setOcrStatus('uploaded');
    };

    const startOCR = () => {
        setOcrStatus('processing');
        setOcrProgress(5);

        const uploadedJobIds = files
            .filter(f => f.status === 'UPLOADED' && f.jobId)
            .map(f => f.jobId!);

        if (uploadedJobIds.length === 0) return;

        let elapsed = 0;
        const maxProgress = 90;
        const interval = setInterval(async () => {
            elapsed += 2;
            const fakeProgress = Math.min(maxProgress, 5 + (maxProgress - 5) * (1 - Math.exp(-elapsed / 40)));
            setOcrProgress(Math.round(fakeProgress));

            try {
                const results: JobResult[] = [];
                let allDone = true;

                for (const jobId of uploadedJobIds) {
                    const resp = await api.get(`/jobs/${jobId}`);
                    const job = resp.data;
                    results.push(job);

                    if (job.status !== 'completed' && job.status !== 'failed') {
                        allDone = false;
                    }
                }

                if (allDone) {
                    clearInterval(interval);
                    setPollingInterval(null);
                    setOcrProgress(100);
                    setJobResults(results);
                    const anyFailed = results.some(r => r.status === 'failed');
                    setOcrStatus(anyFailed ? 'failed' : 'completed');
                }
            } catch {
                // Continue polling on error
            }
        }, 3000);

        setPollingInterval(interval);
    };

    const resetAll = () => {
        if (pollingInterval) clearInterval(pollingInterval);
        setFiles([]);
        setOcrStatus('idle');
        setOcrProgress(0);
        setJobResults([]);
        setPollingInterval(null);
    };

    const uploadedCount = files.filter(f => f.status === 'UPLOADED').length;
    const totalExtractions = jobResults.reduce((sum, j) => sum + (j.extractions?.length || 0), 0);
    const avgConfidence = jobResults.length > 0
        ? jobResults.reduce((sum, j) => sum + (j.avg_confidence || 0), 0) / jobResults.length
        : 0;

    return (
        <div className="space-y-6">
            {/* Language selector */}
            {ocrStatus === 'idle' && (
                <div className="flex items-center gap-3">
                    <Languages className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t('language')}:</span>
                    <div className="flex gap-2">
                        {[
                            { code: 'ar', label: 'العربية' },
                            { code: 'en', label: 'English' },
                            { code: 'fr', label: 'Français' },
                        ].map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLanguage(lang.code)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                                    selectedLanguage === lang.code
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-300"
                                )}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Dropzone */}
            {(ocrStatus === 'idle' || ocrStatus === 'uploading' || ocrStatus === 'uploaded') && (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center",
                        isDragActive
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950",
                        (ocrStatus === 'uploading') && "opacity-50 pointer-events-none"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
                        <Upload className={cn("h-8 w-8", isDragActive ? "text-blue-500" : "text-zinc-400")} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                        {isDragActive ? t('dropzoneActive') : t('dropzoneInactive')}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                        {t('dropzoneDesc')}
                    </p>
                </div>
            )}

            {/* File list */}
            {files.length > 0 && ocrStatus !== 'completed' && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            {t('filesToUpload')} ({files.length})
                        </h4>
                        {ocrStatus === 'idle' && (
                            <Button variant="outline" size="sm" onClick={() => setFiles([])} className="h-8 rounded-lg">
                                {t('clearAll')}
                            </Button>
                        )}
                    </div>
                    <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                        {files.map((file) => (
                            <div key={file.id} className="group p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    file.status === 'UPLOADED' ? "bg-green-50 dark:bg-green-900/20" :
                                    file.status === 'ERROR' ? "bg-red-50 dark:bg-red-900/20" :
                                    "bg-zinc-50 dark:bg-zinc-800"
                                )}>
                                    {file.status === 'UPLOADED' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : file.status === 'ERROR' ? (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <FileIcon className="h-5 w-5 text-zinc-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{file.name}</p>
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 ml-2 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    {file.status === 'UPLOADING' && <Progress value={file.progress} className="h-1.5" />}
                                    {file.status === 'UPLOADED' && (
                                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                                            <CheckCircle2 className="h-3 w-3" /> {t('readyForOcr')}
                                        </span>
                                    )}
                                    {file.status === 'PENDING' && <span className="text-xs text-zinc-400">{t('pendingUpload')}</span>}
                                    {file.status === 'ERROR' && (
                                        <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
                                            <AlertCircle className="h-3 w-3" /> {t('failed_status')}
                                        </span>
                                    )}
                                </div>
                                {ocrStatus === 'idle' && (
                                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="rounded-full h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                        {ocrStatus === 'idle' && (
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20" onClick={handleUpload}>
                                <Upload className="mr-2 h-5 w-5" />
                                {t('startUpload')}
                            </Button>
                        )}
                        {ocrStatus === 'uploading' && (
                            <Button className="w-full bg-blue-600 text-white rounded-xl h-12 text-base font-bold" disabled>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {t('uploadingFiles')}
                            </Button>
                        )}
                        {ocrStatus === 'uploaded' && uploadedCount > 0 && (
                            <Button
                                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl h-14 text-base font-bold shadow-lg shadow-violet-200 dark:shadow-violet-900/20 animate-in fade-in zoom-in-95 duration-300"
                                onClick={startOCR}
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                {t('startOcr')} ({uploadedCount} {uploadedCount === 1 ? t('fileLabel') : t('filesLabel')})
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* OCR Processing Progress */}
            {ocrStatus === 'processing' && (
                <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200 dark:border-violet-800/50 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t('ocrProcessing')}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('ocrProcessingDesc')}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{t('progress')}</span>
                            <span className="font-bold text-violet-600 dark:text-violet-400">{ocrProgress}%</span>
                        </div>
                        <div className="relative h-3 rounded-full bg-violet-100 dark:bg-violet-900/50 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700 ease-out"
                                style={{ width: `${ocrProgress}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {ocrProgress < 30 ? t('ocrStep1') :
                             ocrProgress < 60 ? t('ocrStep2') :
                             ocrProgress < 90 ? t('ocrStep3') :
                             t('ocrStep4')}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-2">
                        {files.filter(f => f.status === 'UPLOADED').map((file) => (
                            <div key={file.id} className="flex items-center gap-3 bg-white/60 dark:bg-zinc-800/40 rounded-xl p-3 border border-violet-100 dark:border-violet-800/30">
                                <Loader2 className="h-4 w-4 text-violet-500 animate-spin shrink-0" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">{file.name}</span>
                                <Badge className="ml-auto bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border-0 text-[10px]">
                                    {t('processing_status')}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* OCR Results */}
            {ocrStatus === 'completed' && jobResults.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Success banner */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t('ocrComplete')}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('ocrCompleteDesc')}</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={resetAll}
                                className="rounded-xl border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                            >
                                {t('uploadMore')}
                            </Button>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalExtractions}</p>
                                    <p className="text-xs text-zinc-500">{t('extractionsFound')}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{Math.round(avgConfidence * 100)}%</p>
                                    <p className="text-xs text-zinc-500">{t('avgConfidenceLabel')}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{jobResults.length}</p>
                                    <p className="text-xs text-zinc-500">{t('filesProcessed')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results per job */}
                    {jobResults.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{job.filename}</h4>
                                        <p className="text-xs text-zinc-500">{job.extractions?.length || 0} {t('extractionsFound')} &bull; {t('confidenceScore')}: {Math.round((job.avg_confidence || 0) * 100)}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={cn(
                                        "text-[10px] font-bold border-0",
                                        job.status === 'completed'
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                                    )}>
                                        {job.status === 'completed' ? t('completed_status') : t('failed_status')}
                                    </Badge>
                                    <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs font-bold" onClick={() => router.push(`jobs/${job.id}`)}>
                                        <Eye className="mr-1 h-3 w-3" />
                                        {t('viewDetails')}
                                    </Button>
                                </div>
                            </div>

                            {job.extractions && job.extractions.length > 0 && (
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {job.extractions.slice(0, 5).map((ext, idx) => (
                                        <div key={ext.id} className="px-4 py-3 flex items-start gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500 shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed" dir="auto">
                                                    {ext.answer_text}
                                                </p>
                                                {ext.question_text && (
                                                    <p className="text-xs text-zinc-400 mt-0.5 italic">{ext.question_text}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    ext.confidence > 0.9 ? "bg-green-500" :
                                                    ext.confidence > 0.7 ? "bg-amber-500" : "bg-red-500"
                                                )} />
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    ext.confidence > 0.9 ? "text-green-600" :
                                                    ext.confidence > 0.7 ? "text-amber-600" : "text-red-600"
                                                )}>
                                                    {Math.round(ext.confidence * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {job.extractions.length > 5 && (
                                        <div className="px-4 py-3 text-center">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold text-xs" onClick={() => router.push(`jobs/${job.id}`)}>
                                                {t('viewAllExtractions')} ({job.extractions.length - 5} {t('moreItems')})
                                                <ArrowRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Failed state */}
            {ocrStatus === 'failed' && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t('ocrFailed')}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('ocrFailedDesc')}</p>
                        </div>
                        <Button onClick={resetAll} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
                            {t('tryAgain')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
