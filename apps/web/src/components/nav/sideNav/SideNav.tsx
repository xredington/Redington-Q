"use client"

import { ComponentIcon, Info, LayoutDashboard, LogOutIcon, MessageSquareDiff, Network, NotebookText, PhoneOutgoing, Send, Settings, Settings2, Settings2Icon, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@repo/ui/components/ui/sidebar';

import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@repo/ui/components/ui/dropdown-menu';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';



export const NavItems = [
    {
        label: "Control Panel",
        href: "/dashboard",
        icon: <ComponentIcon className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "Dashboard",
        href: "/",
        icon: <LayoutDashboard className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "QChat",
        href: "/qchat",
        icon: <MessageSquareDiff className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "QLearn",
        href: "/qlearn",
        icon: <Network className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "Canvas",
        href: "/canvas",
        icon: <NotebookText className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "QCall",
        href: "/qcall",
        icon: <PhoneOutgoing className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "QGrid",
        href: "https://app.usefindr.com",
        icon: <Send className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    },
    {
        label: "QSupport",
        href: "/qsupport",
        icon: <Info className={`flex-shrink-0  w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6`} />
    }
];

export function SideNav() {
    const { data: session } = useSession();
    const user=useSelector((state:RootState)=>state.user)
    const role =user.role.toLowerCase();
    const fallback: string = user?.name ? (() => {
        const nameParts = user.name.split(' ');
        const firstNameFirstLetter = nameParts[0]?.[0] ?? '';
        const lastNameLastLetter = nameParts.length > 1 ? nameParts[nameParts.length - 1]!.slice(-1) : '';
        return firstNameFirstLetter.toUpperCase() + lastNameLastLetter.toUpperCase();
    })() : '';

    return (
        <Sidebar>
            <SidebarBody className="justify-between pl-5">
                <div className="flex flex-col flex-1 justify-between overflow-y-auto overflow-x-hidden">
                    <>
                        <Link className={`flex items-center gap-3 justify-start`} href="/">
                            <Image src={"/assets/logo.svg"} alt="Logo" width={30} height={30} className={`flex-shrink-0`}/>
                            <Image src={"/assets/REDINGTON.png"} alt="Redeem" width={120} height={10} className={`w-auto`} />
                        </Link>
                    </>
                    <nav className="flex flex-col gap-3 xl:gap-5">
                        {NavItems.filter(item => role === "user" ? item.label !== "Control Panel" : true)
                            .map((link, idx) => (
                                <SidebarLink key={idx + 1} link={link} />
                            ))}
                    </nav>
                    <nav className={`flex items-center gap-3 justify-start`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className='flex-shrink-0 shadow-gray-400 shadow-sm h-6 w-6 2xl:h-7 2xl:w-7  rounded-full hover:cursor-pointer'>
                                    <AvatarImage src={user.image ? `${user.image}` : 'assets/avatar.jpg'} alt="" />
                                    <AvatarFallback className='text-sm'>
                                        {fallback}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className='w-60'>
                                <DropdownMenuLabel className='text-green-600 font-medium'>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem> <Link href='/profile' className='flex items-center justify-center gap-3'> <User />Profile</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className='flex items-center gap-3 hover:cursor-pointer' >
                                    <LogOutIcon/> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <p className={`text-neutral-700 text-sm 2xl:text-xl dark:text-neutral-200 group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0`}>
                            {user.name ? `${user.name}` : 'User'}
                        </p>
                    </nav>
                </div>
            </SidebarBody>
        </Sidebar>

    );
}

