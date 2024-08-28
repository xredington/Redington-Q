import dynamic from "next/dynamic";
 
const Editor = dynamic(() => import("@/components/editor/Editor"), { ssr: false });
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import React from 'react';

const page = () => {
    return (
        <main className={`w-95 mx-auto py-6 flex-grow flex items-center justify-center`}>
            <ScrollArea className={`w-full h-[calc(100vh-7rem)]`}>
                <Editor className={`editor-main`} />
            </ScrollArea>
        </main>
    );
};

export default page;