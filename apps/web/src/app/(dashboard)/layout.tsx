"use client";
import RootHeader from '@/components/headers/RootHeader';
import { SideNav } from '@/components/nav/sideNav/SideNav';
import { setUser } from '@/lib/store/features/user/UserSlice';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { cn } from '@repo/ui/lib/utils';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const DashboardLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { data: session } = useSession();

    const dispatch = useDispatch();

    useEffect(() => {
        const updateUserVisit = async () => {
            if (session) {
                const userId = session.user.id;
                const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

                const lastVisitDate = localStorage.getItem('last-visit-date');
                if (lastVisitDate !== today) {
                    try {
                        await axios.post('/api/analytics/user-visits', { userId });
                        localStorage.setItem('last-visit-date', today as string);
                    } catch (error) {
                        console.error('Failed to update user visit:', error);
                    }
                }
            }
        };

        updateUserVisit();
    }, [session]);

    useEffect(() => {
        if (session?.user) {
            dispatch(setUser({
                id: session.user.id,
                name: session.user.name ?? '',
                email: session.user.email ?? '',
                role: session.user.role,
                approved: session.user.approved,
                noteId: session.user.noteId,
                isQCallAccessible: session.user.isQCallAccessible,
                serviceAccessRoles: session.user.serviceAccessRoles,
                image: session.user.image ?? '',
            }));
        }
    }, [session, dispatch]);

    return (
        <section className={cn(
            "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border bg-white/60 backdrop-blur-lg border-neutral-200 dark:border-neutral-700 overflow-hidden",
            "h-screen"
        )}>
            <SideNav />
            <ScrollArea className={`h-screen bg-white flex shadow-gray-200 shadow-lg border-gray-200 border-l flex-grow rounded-tl-3xl`}>
                <section className={`flex-grow h-auto`}>
                    <RootHeader />
                    {children}
                </section>
            </ScrollArea>
        </section>
    );
};

export default DashboardLayout;
