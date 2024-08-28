"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import { AI } from '@/constants';
import { ErrorComponent } from '@/views/error/ErrorComponent';
import { Construction, X } from 'lucide-react';

const Page = () => {
    const { brand } = useParams<{ brand: string }>();
    const { data: session } = useSession();
    const pathname = usePathname()
    if (!brand) {
        return <p className="text-center">Brand is missing from the URL parameters.</p>;
    }

    const lowerCaseBrand = brand.toLowerCase() as ("aruba" | "fortinet" | "hp" | "huawei");
    const brandCategory = AI.find(item => item.category === "QChat")
        ?.components.find(subcategory => subcategory.name.toLowerCase() === lowerCaseBrand);

    const userHasAccess = session?.user?.serviceAccessRoles?.includes(lowerCaseBrand);

    if (!userHasAccess) {
        return (
            <main className="flex-grow relative w-95 mt-10 mx-auto flex items-center justify-center pb-6">
                <ErrorComponent
                    title={brand} description={"You don't have access to this service. Please contact the admin to request access."}
                    icon={<X />} />
            </main>
        );
    }

    if (!brandCategory?.components) {
        return (
            <main className="flex-grow relative w-95 mt-10 mx-auto  flex items-center justify-center pb-6">
                <ErrorComponent title={brand} description={"We are currently working on this service please check back later"} icon={<Construction />} />
            </main>
        );
    }

    return (
        <main className="flex-grow relative w-95 mx-auto flex flex-col pb-6">
            <div className="flex items-center justify-center gap-5 mr-auto">
                <h1 className="text-2xl sm:text-4xl my-10">
                    <span className="text-green-600">Q</span>{brand.charAt(0).toUpperCase() + brand.slice(1)}
                </h1>
            </div>
            <section className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mx-auto auto-rows-[18rem] lg:auto-rows-[13.5rem]"}>
                {brandCategory.components.map((item) => (
                    <Link key={item.id} href={`${pathname}/${item.id}`} className={`${item.className} row-span-1`}>
                        <div className={`h-full w-full relative group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] ${item.id === 'sales-ai' || item.id === 'tech-ai' || item.id === 'designer-ai' ? 'bg-green-700/60' : 'bg-[#F3F4ED]'} border border-transparent justify-between flex flex-col space-y-4 rounded-3xl overflow-hidden`}>
                            {item.id === 'sales-ai' || item.id === 'tech-ai' || item.id === 'designer-ai' ? (
                                <Image src="/assets/card-cover.png" alt="" layout="fill" className="top-0 left-0 absolute h-full w-full z-10 opacity-60" />
                            ) : null}
                            <div className="px-3 w-full h-full flex flex-col items-start justify-center gap-3 z-20 sticky">
                                <p className={` ${item.id === 'sales-ai' || item.id === 'tech-ai' || item.id === 'designer-ai' ? 'text-slate-50' : 'text-green-600'}`}>
                                    {item.icon && <item.icon />}
                                </p>
                                <div className="flex justify-between items-center w-full">
                                    <h3 className={`text-xl sm:text-2xl font-bold ${item.id === 'sales-ai' || item.id === 'tech-ai' || item.id === 'designer-ai' ? 'text-slate-50' : 'text-card-foreground'}`}>
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
};

export default Page;
