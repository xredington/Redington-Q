"use client";
import React, { useEffect, useRef, useState } from 'react';
import Editor from '@/components/editor/Editor';
import AiMenubar from '@/components/menubars/AiMenubar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@repo/ui/components/ui/resizable';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { AI } from '@/constants';
import AiContentLoader from '@/components/aiContentLoader/AiContentLoader';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ErrorComponent } from '@/views/error/ErrorComponent';
import { Construction, X } from 'lucide-react';

interface PanelGroupRef {
    setLayout: (sizes: number[]) => void;
    getId: () => string;
    getLayout: () => number[];
}

const updateUsage = async (userId: string, toolName: string, brandName: string) => {
    try {
        await Promise.all([
            axios.post('/api/analytics/brand-usage', { userId, brandName }),
            axios.post('/api/analytics/tool-usage', { userId, toolName }),
        ]);
    } catch (error) {
        console.error('Failed to update usage:', error);
    }
};

const Page = () => {
    const menuItems = ["canvas", "both", "chat"];
    const [active, setActive] = useState<string>("both");
    const { brand, id } = useParams<{ brand: string, id: string }>();

    const { data: session } = useSession();

    const lowerCaseBrand = brand.toLowerCase() as ("aruba" | "fortinet" | "hp" | "huawei");

    const userHasAccess = session?.user?.serviceAccessRoles?.includes(lowerCaseBrand);

    
    const panelGroupRef = useRef<PanelGroupRef | null>(null);

    const data = AI.find(category => category.category === "QChat")
    ?.components?.find(subcategory => subcategory.name.toLowerCase() === brand)
    ?.components?.find(component => component.id === id);

    const changeLayout = (active: string) => {
        if (panelGroupRef.current) {
            if (active === "canvas") {
                panelGroupRef.current.setLayout([100, 0]);
            } else if (active === "chat") {
                panelGroupRef.current.setLayout([0, 100]);
            } else {
                panelGroupRef.current.setLayout([37.5, 62.5]);
            }
        }
    };

    const handleStateChange = (newActive: string) => {
        setActive(newActive);
        changeLayout(newActive);
    };

    useEffect(() => {
        if (panelGroupRef.current) {
            changeLayout(active);
        }
    }, [active]);

    useEffect(() => {
        const executeUpdateUsage = async () => {
            if (session && brand && data) {
                const userId = session.user.id;
                const toolName = `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${data.title || ''}`;
                const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);

                try {
                    await updateUsage(userId, toolName, brandName);
                } catch (error) {
                    console.error('Failed to update usage:', error);
                }
            }
        };

        if (data) {
            executeUpdateUsage();
        }
    }, [data, session, brand]);

    if (!userHasAccess) {
        return (
            <main className="flex-grow relative w-95 mx-auto mt-10  flex items-center justify-center pb-6">
                <ErrorComponent
                    title={brand} description={"You don't have access to this service. Please contact the admin to request access."}
                    icon={<X />} />
            </main>
        );
    }

    if (!data) {
        return (
            <main className="flex-grow relative w-95 mx-auto mt-10  flex items-center justify-center pb-6">
                <ErrorComponent title={brand} description={"We are currently working on this service please check back later"} icon={<Construction />} />
            </main>
        );
    }

    return (
        <main className="w-95 relative mx-auto flex flex-col flex-grow gap-5 py-3">
            <div className={`flex w-full items-center justify-end`}>
                <AiMenubar active={active} setActive={handleStateChange} menuItems={menuItems} />
            </div>
            <ResizablePanelGroup
                ref={panelGroupRef}
                direction="horizontal"
                className="flex flex-grow w-full "
            >
                <ResizablePanel
                    className={`transition-all duration-700 ease-in-out ${active !== 'chat' ? 'visible' : 'invisible'}`}
                    defaultSize={37.5}
                    minSize={0}
                >
                    <ScrollArea className={`w-[99%] h-[calc(100vh-11rem)] ${active !== 'learn' ? 'visible' : 'invisible'} ${active === 'canvas' ? 'w-full' : ''}`}>
                        <Editor />
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className={`transition-all border-none duration-700 ease-in-out ${active !== 'notepad' ? 'visible' : 'invisible'}`}
                    defaultSize={62.5}
                    minSize={0}
                >
                    <div className={`ml-auto w-[95%] h-full bg-white/50 backdrop-blur-3xl backdrop-filter rounded-3xl overflow-hidden flex items-center justify-center ${active === 'chat' ? 'w-full h-full' : ''}`}>
                        <AiContentLoader component={data} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
};

export default Page;
