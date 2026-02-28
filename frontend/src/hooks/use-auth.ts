'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '@/i18n/routing';
import api from '@/lib/axios';

export type UserRole = 'admin' | 'teacher';

interface User {
    id: number;
    email: string;
    full_name: string | null;
    role: UserRole;
    is_active: boolean;
}

import type { LoginFormValues } from '@/lib/validations/auth';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('ocr_user');
        const storedToken = localStorage.getItem('ocr_token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user session');
                localStorage.removeItem('ocr_user');
                localStorage.removeItem('ocr_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', data.email);
            formData.append('password', data.password);

            const response = await api.post('/auth/login', formData.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token } = response.data;

            // Store token first so the interceptor picks it up for /me
            localStorage.setItem('ocr_token', access_token);

            // Get user info
            const userResponse = await api.get('/auth/me');
            const userData: User = userResponse.data;

            localStorage.setItem('ocr_user', JSON.stringify(userData));
            setUser(userData);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            localStorage.removeItem('ocr_token');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem('ocr_token');
        localStorage.removeItem('ocr_user');
        setUser(null);
        router.push('/login');
    }, [router]);

    return {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };
}
