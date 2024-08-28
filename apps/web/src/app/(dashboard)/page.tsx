"use client";
import React, { useEffect, useState } from 'react';
import FavTools from "@/components/dashboard/FavTools";
import Tools from "@/components/dashboard/Tools";
import TopBrands from "@/components/dashboard/TopBrands";
import Visits from "@/components/dashboard/Visits";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Separator } from '@repo/ui/components/ui/separator';

const Page = () => {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState({
    toolUsage: [],
    brandUsage: [],
    visitsByMonth: {},
    totalVisits: 0,
    yAxisUpperBound: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (status === 'authenticated' && session) {
        try {
          const response = await axios.get('/api/analytics/', {
            params: {
              userId: session.user.id,
            },
          });
          setAnalytics(response.data);
        } catch (error) {
          console.error('Failed to fetch user analytics:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
  }, [session, status]);

  if (loading && status === 'loading') {
    return <SkeletonLoading />;
  }

  return (
    <main className="grid grid-cols-2 auto-rows-[14rem] gap-12 flex-grow min-h-screen py-5 w-95 mx-auto">
      <Visits visitsByMonth={analytics.visitsByMonth} totalVisits={analytics.totalVisits} yAxisUpperBound={analytics.yAxisUpperBound} />
      <Tools />
      <FavTools toolUsage={analytics.toolUsage} />
      <TopBrands brandUsage={analytics.brandUsage} />
    </main>
  );
};

export default Page;

const SkeletonCard = () => (
  <div className={`animate-pulse flex flex-col space-y-4 p-4 border rounded-2xl shadow-lg h-full w-full`}>
    <div className="h-2 bg-gray-300 rounded animate-pulse w-5"></div>
    <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
    <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
    <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>
    <div className="h-6 bg-gray-300 rounded animate-pulse w-20"></div>
  </div>
);

const SkeletonChart = () => (
  <section className={`flex flex-col animate-pulse p-2`}>
    <div className={`flex-grow bg-gray-100 shadow-lg shadow-gray-300/75 rounded-3xl p-5`}>
      <div className={`w-full mx-auto flex justify-between items-center`}>
        <div className='h-6 bg-gray-300 animate-pulse rounded w-1/4'></div>
        <div className='h-6 bg-gray-300 animate-pulse rounded w-1/6'></div>
      </div>
      <div className=' bg-gray-300 animate-pulse aspect-video mx-auto rounded-xl mt-5'>
        <div className='relative w-full h-full'>
          <svg className='absolute top-0 left-0 w-full h-full' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
            <path
              fill="none"
              strokeWidth="1"
              d="M0,85 Q50,10 100,50 T200,50"
              className="animated-line stroke-gray-500"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
);


const SkeletonTools = () => (
  <div className="grid md:grid-cols-2 w-full h-full flex-grow gap-6">
    {[...Array(4)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

const SkeletonTablePie = () => (
  <div className="bg-gray-100 h-full shadow-lg shadow-gray-300/75 animate-pulse p-4 rounded-lg">
      <Separator className="mx-auto mb-4 w-11/12 bg-[#C4C4C4]" />
      <div className="flex flex-row items-center justify-between">
          <div className="w-72">
              <div className="flex items-center justify-between py-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-5">
                      <div className="w-4 h-3 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded w-11"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-5">
                      <div className="w-4 h-3 bg-gray-300 rounded-sm"></div>
                      <div className="h-4 bg-gray-300 rounded w-11"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
          </div>
          <div className="aspect-square max-h-32 min-h-32 min-w-32 max-w-32 relative flex justify-center items-center">
                <svg className="w-3/4 h-3/4 animate-spin" viewBox="0 0 50 50">
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="#D1D5DB"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="126"
                        strokeDashoffset="42"
                    />
                </svg>
            </div>
      </div>
  </div>
);

const SkeletonLoading = () => (
  <div className="grid grid-cols-2 grid-rows-3 gap-8 flex-grow h-screen py-5 w-95 mx-auto">
    <div className="row-span-2"><SkeletonChart /></div>
    <div className="row-span-2"><SkeletonTools /></div>
    <SkeletonTablePie />
    <SkeletonTablePie />
  </div>
);
