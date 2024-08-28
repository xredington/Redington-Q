"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';

export const ErrorComponent: React.FC<{ title: string, description: string, icon?: React.ReactNode }> = ({ title, description, icon }) => {
    const router = useRouter()
    return (
        <Card className="w-full bg-white/20 backdrop-blur-xl max-w-lg mx-auto shadow-lg mt-16">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <div className="bg-gray-100 text-orange-800 p-4 rounded-full shadow-lg">
                        {icon}
                    </div>
                </div>
                <CardTitle className="text-center text-2xl font-bold text-gray-800 mt-4">{title.toLocaleUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-600 text-center">{description}</CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => window.history.back()} // Navigates back to the previous page
                >
                    Go Back
                </Button>
                <Button
                    onClick={() => router.push('/')} // Redirects user to the home page
                >
                    Home
                </Button>
            </CardFooter>
        </Card>
    );
};