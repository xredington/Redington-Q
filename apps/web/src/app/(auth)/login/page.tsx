import { Login } from '@/views/auth/login/Login';
import { BackgroundGradient } from '@repo/ui/components/ui/background-gradient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import Link from 'next/link';
import React from 'react';

const Page = () => {
    return (
        <main className={`flex flex-grow items-center justify-center w-full h-screen bg-white/80`}>
            <BackgroundGradient className="rounded-[22px] max-w-md p-0  dark:bg-zinc-900">
                <Card className="mx-auto w-full rounded-[22px] border-none shadow-none  bg-white/90 backdrop-blur-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign In</CardTitle>
                        <CardDescription>
                            Please enter your credentials to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Login />
                    </CardContent>
                    <CardFooter>
                        <CardDescription className="mt-3 text-center text-sm text-gray-500 3xl:text-base">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-green-700 hover:text-green-500"
                            >
                                Sign up here
                            </Link>
                        </CardDescription>
                    </CardFooter>
                </Card>
            </BackgroundGradient>
        </main>
    );
};

export default Page;