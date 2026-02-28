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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Users,
    UserPlus,
    Shield,
    ShieldCheck,
    MoreHorizontal,
    Search,
} from 'lucide-react';
import api from '@/lib/axios';

interface UserEntry {
    id: number;
    email: string;
    full_name: string | null;
    role: 'admin' | 'teacher';
    is_active: boolean;
}

export default function UsersPage() {
    const t = useTranslations('Dashboard');
    const { user } = useAuth();
    const [users, setUsers] = useState<UserEntry[]>([
        { id: 1, email: 'admin@institution.edu', full_name: 'Administrator', role: 'admin', is_active: true },
    ]);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', full_name: '', password: '', role: 'teacher' as 'admin' | 'teacher' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.full_name?.toLowerCase().includes(search.toLowerCase()))
    );

    const handleAddUser = async () => {
        setError('');
        if (!newUser.email || !newUser.password) {
            setError(t('requiredFields'));
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await api.post('/auth/register', {
                email: newUser.email,
                password: newUser.password,
                full_name: newUser.full_name || null,
                role: newUser.role,
            });
            setUsers(prev => [...prev, response.data]);
            setNewUser({ email: '', full_name: '', password: '', role: 'teacher' });
            setDialogOpen(false);
        } catch (err: any) {
            setError(err?.response?.data?.detail || t('addUserError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-2">
                    <Shield className="h-12 w-12 text-zinc-300 mx-auto" />
                    <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300">{t('accessDenied')}</h2>
                    <p className="text-zinc-500">{t('adminOnly')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {t('usersTitle')}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        {t('usersDesc')}
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 shadow-lg shadow-blue-500/20">
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t('addUser')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{t('addNewUser')}</DialogTitle>
                            <DialogDescription>{t('addUserDesc')}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t('fullName')}</Label>
                                <Input
                                    id="fullName"
                                    value={newUser.full_name}
                                    onChange={e => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                                    placeholder={t('fullNamePlaceholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('emailLabel')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder={t('emailPlaceholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('passwordLabel')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder={t('passwordPlaceholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('roleLabel')}</Label>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant={newUser.role === 'teacher' ? 'default' : 'outline'}
                                        size="sm"
                                        className="rounded-lg"
                                        onClick={() => setNewUser(prev => ({ ...prev, role: 'teacher' }))}
                                    >
                                        {t('roleTeacher')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={newUser.role === 'admin' ? 'default' : 'outline'}
                                        size="sm"
                                        className="rounded-lg"
                                        onClick={() => setNewUser(prev => ({ ...prev, role: 'admin' }))}
                                    >
                                        {t('roleAdmin')}
                                    </Button>
                                </div>
                            </div>
                            {error && (
                                <p className="text-sm text-red-500 font-medium">{error}</p>
                            )}
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11"
                                onClick={handleAddUser}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('creating') : t('createUser')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                    placeholder={t('searchUsers')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-800"
                />
            </div>

            {/* Users Table */}
            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-200 dark:border-zinc-800">
                                <TableHead className="font-bold">{t('fullName')}</TableHead>
                                <TableHead className="font-bold">{t('emailLabel')}</TableHead>
                                <TableHead className="font-bold">{t('roleLabel')}</TableHead>
                                <TableHead className="font-bold">{t('status')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((u) => (
                                <TableRow key={u.id} className="border-zinc-100 dark:border-zinc-800/50">
                                    <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                                    <TableCell className="text-zinc-500">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="rounded-md gap-1">
                                            {u.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                            {u.role === 'admin' ? t('roleAdmin') : t('roleTeacher')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={u.is_active ? 'default' : 'destructive'} className="rounded-md">
                                            {u.is_active ? t('active') : t('inactive')}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-zinc-400">
                                        {t('noUsersFound')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
