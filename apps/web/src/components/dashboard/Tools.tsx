"use client";
import React, { useMemo } from 'react';
import { NavItems } from '@/components/nav/sideNav/SideNav';
import { Card, CardTitle } from '@repo/ui/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const Tools = () => {
  const filteredNavItems = useMemo(() => [
    NavItems.find(item => item.label === "Canvas"),
    NavItems.find(item => item.label === "QChat"),
    NavItems.find(item => item.label === "QLearn"),
    NavItems.find(item => item.label === "QCall"),
  ], []);

  return (
    <section className={`flex flex-col gap-6  w-full row-span-2 h-full`}>
    <div className={`col-span-2`}>
        <h2 className={`text-3xl`}>Tools</h2>
    </div>
    <div className={`grid md:grid-cols-2 w-full flex-grow gap-8`}>

        {filteredNavItems.map((item, index) => item && (
            <Link href={item.href} key={index} className='h-full w-full hover:cursor-pointer'>
                <Card className={`h-full w-full overflow-clip flex flex-col justify-center items-start gap-3 p-6 relative shadow-lg rounded-3xl border-none backdrop-blur-3xl backdrop-filter ${index === 0 ? 'bg-green-700/50' : 'bg-[#F3F4ED]'}  hover:shadow-xl shadow-input dark:shadow-none dark:bg-black  flex flex-col rounded-3xl overflow-hidden`}>
                    {index === 0 && <Image src={'/assets/card-cover.png'} alt='' width={300} height={300} className='top-0 left-0 absolute h-full w-full -z-10 opacity-60' />}
                    <span className={index === 0 ? 'text-slate-50' : 'text-green-600'}>{item.icon}</span>
                    <CardTitle className={`text-3xl ${index === 0 ? 'text-slate-50' : ''}`}>
                        {item.label.startsWith('Q') && ['Chat', 'Call', 'Learn', 'Support'].includes(item.label.slice(1)) ?
                            <span>
                                <span className="text-green-600">Q</span>
                                <span>{item.label.slice(1)}</span>
                            </span>
                            : item.label
                        }
                    </CardTitle>
                </Card>
            </Link>
        ))}


    </div>

</section>
  );
};

export default React.memo(Tools);
