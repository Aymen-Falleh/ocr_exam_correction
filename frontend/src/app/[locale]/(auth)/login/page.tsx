'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/i18n-switcher';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const tCommon = useTranslations('Common');
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
        setError(null);
        try {
            await login(data);
        } catch (err) {
            setError(t('error'));
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors duration-500">
            <div className="absolute top-8 right-8">
                <LanguageSwitcher />
            </div>

            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <CardHeader className="space-y-4 pt-10 px-8">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('title')}
                        </CardTitle>
                        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base">
                            {t('description')}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-700 dark:text-zinc-300">{t('email')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('emailPlaceholder')}
                                                {...field}
                                                className="h-12 border-zinc-200 dark:border-zinc-700 focus-visible:ring-blue-500 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs">
                                            {fieldState.error?.message && t(fieldState.error.message)}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-700 dark:text-zinc-300">{t('password')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder={t('passwordPlaceholder')}
                                                {...field}
                                                className="h-12 border-zinc-200 dark:border-zinc-700 focus-visible:ring-blue-500 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs">
                                            {fieldState.error?.message && t(fieldState.error.message)}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {t('signingIn')}
                                    </>
                                ) : (
                                    t('login')
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="bg-zinc-50 dark:bg-zinc-800/50 px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
                        {t('footer')}
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                        <span>{tCommon('arabic')}</span>
                        <span>•</span>
                        <span>{tCommon('english')}</span>
                        <span>•</span>
                        <span>{tCommon('french')}</span>
                    </div>
                </CardFooter>
            </Card>
        </div>

    );
}
