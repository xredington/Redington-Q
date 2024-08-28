"use client"

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@repo/ui/components/ui/breadcrumb';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';


const RootHeader = () => {
    const pathname = usePathname();
    const [greeting] = useState('Greetings');
    const user=useSelector((state:RootState)=>state.user)

    const generateBreadcrumbs = () => {
        const pathSegments = pathname.split('/').filter(Boolean);
        return pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            const isLast = index === pathSegments.length - 1;
            return (
                <React.Fragment key={href}>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href={href}
                            className={`text-base font-medium ${isLast ? 'text-green-600' : 'text-gray-700 hover:text-green-600 transition-colors'}`}
                            aria-current={isLast ? 'page' : undefined}
                        >
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator className="mx-2 text-gray-700" />}
                </React.Fragment>
            );
        });
    };

    const pathSegments = pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-30 pt-4 w-95 h-14 flex mx-auto items-center justify-between gap-4 backdrop-blur-sm backdrop-filter bg-opacity-90">
            <div className="flex items-center gap-4">
                <Breadcrumb className="flex items-center text-gray-800 space-x-2">
                    <BreadcrumbList className="flex items-center">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className={`text-gray-800 ${pathSegments.length === 0 ? 'text-green-600' : ''}  hover:text-green-600 transition-colors`}>
                                <Home className="w-5 h-5" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {pathSegments.length > 0 && (
                            <>
                                <BreadcrumbSeparator className="mx-2 text-gray-700" />
                                {generateBreadcrumbs()}
                            </>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="text-gray-800 text-base font-medium">
                {greeting}, {user.name.split(' ')[0] || 'User'}!
            </div>
        </header>
    );
};

export default RootHeader;
