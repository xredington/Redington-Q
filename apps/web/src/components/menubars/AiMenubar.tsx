import { Button } from '@repo/ui/components/ui/button';
import { Menubar, MenubarMenu, MenubarTrigger } from '@repo/ui/components/ui/menubar';
import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/ui/toggle-group';

import React from 'react';

type AiMenubarTypes = {
    active: string
    setActive: (newActive:string) => void
    menuItems:string[]

}

const AiMenubar = ({ active, setActive, menuItems }: AiMenubarTypes) => {

    console.log(active)
    return (
        <Menubar className={`bg-transparent w-fit h-fit space-x-3 border-none shadow-none`}>
            {
                menuItems.map((item, index) => (
                    <Button key={index} className={`h-11 rounded-3xl capitalize`} variant={active===item?"default":'secondary'} onClick={() => setActive(item)}>{ item}</Button>
                ))
            }
        </Menubar>
    );
};

export default AiMenubar;