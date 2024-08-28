import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@repo/ui/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from '@repo/ui/components/ui/drawer';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/use-media-query';

const passwordFormSchema = z.object({
    currentPassword: z.string().min(4, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface ResponsiveDialogDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    handlePasswordChange: (data: PasswordFormValues) => Promise<void>;
}

const ResponsiveDialogDrawer: React.FC<ResponsiveDialogDrawerProps> = ({
    isOpen,
    onClose,
    handlePasswordChange,
}) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
    });

    const onSubmit = async (data: PasswordFormValues) => {
        try {
            await handlePasswordChange(data);
            toast.success('Password updated successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    const Form = (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        {...register('currentPassword')}
                        placeholder="Enter current password"
                    />
                    {errors.currentPassword && <p className="text-red-600">{errors.currentPassword.message}</p>}
                </div>
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        {...register('newPassword')}
                        placeholder="Enter new password"
                    />
                    {errors.newPassword && <p className="text-red-600">{errors.newPassword.message}</p>}
                </div>
                <div className="flex justify-end gap-2 px-4">
                    <Button type="submit" className='w-full'>Save</Button>
                </div>
            </form>
        </>
    );

    if (isDesktop) {
        return (
            <Dialog onOpenChange={onClose}>
                <DialogTrigger>
                    <Button>
                        Change Password
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Update your password here. Make sure to use a strong one.</DialogDescription>
                    </DialogHeader>
                    {Form}
                    <DialogFooter className='w-full'>
                        <DialogClose className='w-full px-4'>
                            <Button variant="outline" className='w-full'>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer onOpenChange={onClose}>
            <DrawerTrigger asChild>
                <Button>
                    Change Password
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Change Password</DrawerTitle>
                    <DrawerDescription>Update your password here. Make sure to use a strong one.</DrawerDescription>
                </DrawerHeader>
                {Form}
                <DrawerFooter className="w-full">
                    <DrawerClose asChild className='w-full'>
                        <Button variant="outline" className='w-full'>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ResponsiveDialogDrawer;
