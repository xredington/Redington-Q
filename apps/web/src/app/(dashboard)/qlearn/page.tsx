"use client";
import { Brands } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';


const Page = () => {
    const pathname = usePathname()
    return (
        <main className="flex-grow relative w-95 mx-auto flex flex-col pb-6">
            <div className="flex items-center justify-center gap-5 mr-auto">
                <h1 className="text-2xl sm:text-4xl my-10"><span className="text-green-600">Q</span>Learn</h1>
            </div>
            <section className={"grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto auto-rows-[18rem] lg:auto-rows-[13.5rem]"}>
                {Brands.map((brand) => (
                    <Link key={brand.id} href={`${pathname}/${brand.title.toLowerCase()}`} className={`row-span-1`}>
                        <div className={`h-full w-full relative group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] ${brand.bgClass} border border-transparent justify-between flex flex-col space-y-4 rounded-3xl overflow-hidden`}>
                            {brand.imgSrc && (
                                <Image src={brand.imgSrc} alt="" layout="fill" className="top-0 left-0 absolute h-full w-full z-10 opacity-60" />
                            )}
                            <div className="px-3 w-full h-full flex flex-col items-start justify-center gap-3 z-20 sticky">
                                {brand.icon && <brand.icon className={`w-10 h-10 ${brand.id === 'aruba' || brand.id === 'huawei' ? 'text-slate-50 fill-slate-50' :'text-green-600 fill-green-600' }`} />}
                                <div className="flex justify-between items-center w-full">
                                    <h3 className={`text-xl sm:text-2xl font-bold ${brand.id === 'aruba' || brand.id === 'huawei' ? 'text-slate-50' : 'text-card-foreground'}`}>{brand.title}</h3>
                                    <div className={`h-8 border w-8 rounded-full ${brand.id === 'aruba' || brand.id === 'huawei' ? 'border-slate-50/30' : 'border-slate-400/30'} flex items-center justify-center`}>
                                        <Icon bg={brand.id === 'aruba' || brand.id === 'huawei' ? 'text-slate-50' : 'text-green-600'} />
                                    </div>
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

const Icon = ({ bg }: { bg: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`h-4 w-4 ${bg}`}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
        </svg>
    );
};
