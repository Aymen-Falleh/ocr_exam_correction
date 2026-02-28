'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Upload,
    File as FileIcon,
    X,
    CheckCircle2,
    AlertCircle,
    FileText,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios';

interface FileWithStatus {
    id: string;
    file: File;
    name: string;
    size: number;
    status: 'PENDING' | 'UPLOADING' | 'COMPLETED' | 'ERROR';
    progress: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
};

export function FileDropzone() {
    const t = useTranslations('Dashboard');
    const [files, setFiles] = useState<FileWithStatus[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: FileWithStatus[] = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            name: file.name,
            size: file.size,
            status: 'PENDING',
            progress: 0,
        }));

        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_FILE_SIZE,
    });

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleUpload = async () => {
        setIsUploading(true);
        const language = "ar"; // Dynamic language could be added to UI

        for (const file of files) {
            if (file.status === 'COMPLETED') continue;

            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'UPLOADING', progress: 0 } : f));

            try {
                const formData = new FormData();
                formData.append('file', file.file);
                formData.append('language', language);

                await api.post('/jobs/upload', formData, {
                    onUploadProgress: (progressEvent: any) => {
                        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress } : f));
                    }
                });

                setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'COMPLETED', progress: 100 } : f));
            } catch (error) {
                console.error('Upload failed:', error);
                setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'ERROR' } : f));
            }
        }
        setIsUploading(false);
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center",
                    isDragActive
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className={cn("h-8 w-8", isDragActive ? "text-blue-500" : "text-zinc-400")} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                    {isDragActive ? t('dropzoneActive') : t('dropzoneInactive')}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                    {t('dropzoneDesc')}
                </p>
            </div>

            {files.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            {t('filesToUpload')} ({files.length})
                        </h4>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFiles([])}
                            className="h-8 rounded-lg"
                            disabled={isUploading}
                        >
                            {t('clearAll')}
                        </Button>
                    </div>
                    <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="group p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                                    <FileIcon className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{file.name}</p>
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    {file.status === 'UPLOADING' && (
                                        <Progress value={file.progress} className="h-1" />
                                    )}
                                    {file.status === 'COMPLETED' && (
                                        <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                                            <CheckCircle2 className="h-3 w-3" /> {t('readyForOcr')}
                                        </span>
                                    )}
                                    {file.status === 'PENDING' && (
                                        <span className="text-xs text-zinc-400">{t('pendingUpload')}</span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(file.id)}
                                    className="rounded-full h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    disabled={isUploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11"
                            disabled={isUploading || files.every(f => f.status === 'COMPLETED')}
                            onClick={handleUpload}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('uploadingFiles')}
                                </>
                            ) : (
                                t('startUpload')
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
