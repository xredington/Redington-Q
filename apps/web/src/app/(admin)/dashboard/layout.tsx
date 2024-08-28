"use client";

import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { cn } from '@repo/ui/lib/utils';
import RootHeader from '@/components/headers/RootHeader';
import { SideNav } from '@/components/nav/sideNav/SideNav';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/store/features/user/UserSlice';
import axios from 'axios';

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const updateUserVisit = async () => {
            if (session) {
                const userId = session.user.id;
                const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

                const lastVisitDate = localStorage.getItem('last-visit-date');
                console.log(`Last visit date: ${lastVisitDate}, Today: ${today}`);

                if (lastVisitDate !== today) {
                    try {
                        const response = await axios.post('/api/analytics/user-visits', { userId });
                        console.log('User visit updated', response.data);
                        localStorage.setItem('last-visit-date', today as string);
                    } catch (error) {
                        console.error('Failed to update user visit:', error);
                    }
                }
            }
        };

        updateUserVisit();
    }, [session]);
    const dispatch=useDispatch()
    useEffect(() => {
      if (session?.user) {
        dispatch(setUser({
          id: session.user.id,
          name: session.user.name ?? '',
          email: session.user.email??'',
          role: session.user.role,
          approved: session.user.approved,
          noteId: session.user.noteId,
          isQCallAccessible: session.user.isQCallAccessible,
          serviceAccessRoles: session.user.serviceAccessRoles,
          image: session.user.image ?? '', 
        }));
      }
      if (session?.user.role === 'admin') {
        router.push('/');
    }
    }, [session, dispatch]);



    return (
        <section className={cn(
            "flex flex-col md:flex-row w-full flex-1 mx-auto border bg-white/60 backdrop-blur-lg border-neutral-200 dark:border-neutral-700 overflow-hidden",
            "h-screen"
        )}>
            <SideNav />
            <ScrollArea className={`h-screen bg-white shadow-gray-200 shadow-lg border-gray-200 border-l flex flex-grow rounded-tl-3xl`}>
                <section className={`flex-grow  h-auto `}>
                    <RootHeader />
                    {children}
                </section>
            </ScrollArea>
        </section>
    );
};

export default AdminDashboardLayout;
