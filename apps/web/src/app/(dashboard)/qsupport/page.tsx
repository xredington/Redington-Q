"use client";
import React, { useRef, useState } from 'react';
import { AI } from '@/constants';
import AiContentLoader from '@/components/aiContentLoader/AiContentLoader';
import { ErrorComponent } from '@/views/error/ErrorComponent';
import { Construction } from 'lucide-react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '@/components/loaders/qSkeleton';

const Page = () => {
    const { data: session, status } = useSession();

    const data = AI.find(category => category.category === "QChat")
        ?.components?.find(subcategory => subcategory.name.toLowerCase() === "aruba")
        ?.components?.find(component => component.id === "tech-ai");
        
    if (status === "loading") {
        return <SkeletonLoader />; 
    }
    return (
        <main className="w-95 mx-auto flex flex-col flex-grow gap-5 py-6 relative">
            <div className={`w-full h-[calc(100vh-8rem)]`}>
                {data ? <AiContentLoader component={data} /> :
                    <ErrorComponent title={"Aruba"} description={"We are currently working on this service please check back later"} icon={<Construction />} />

                }
            </div>
        </main>
    );
};

export default Page;
