"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '@/components/loaders/qSkeleton';
import { X } from 'lucide-react';
import { ErrorComponent } from '@/views/error/ErrorComponent';


const Page = () => {

    const { data: session, status } = useSession();


    if (status === "loading") {
        return <SkeletonLoader />; 
    }

    if (!session?.user?.isQCallAccessible) {
        return (
            <main className="flex-grow relative w-95 mt-10 mx-auto  flex items-center justify-center pb-6">
                <ErrorComponent title={"QCall"} description={"You don't have access to this service. Please contact the admin to request access."} icon={<X />} />
            </main>
        );
    }

    return (
        <main className="w-95 mx-auto flex flex-col flex-grow gap-5 py-6 ">
            <iframe
                className={`w-full h-[calc(100vh-5rem)] overflow-hidden rounded-md bg-transparent`}
                allow="microphone"
                src={`https://app.usefindr.com`}
            />
        </main>
    );
};

export default Page;
