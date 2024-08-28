"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Label } from '@repo/ui/components/ui/label';
import { Switch } from '@repo/ui/components/ui/switch';
import { z } from 'zod';

import { toast } from 'sonner';
import axios from 'axios';
import ResponsiveDialogDrawer from './DialogDrawer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/ui/dialog';
import { Button } from '@repo/ui/components/ui/button';
import { FileUpload } from '@repo/ui/components/ui/file-upload';
import Image from 'next/image';
import { Edit } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/store/features/user/UserSlice';



const passwordFormSchema = z.object({
    currentPassword: z.string().min(8, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const UserProfile: React.FC = () => {
    const { data: session, status } = useSession();
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>(user?.image || '/assets/avatar.jpg');

    const handlePasswordChange = async (data: PasswordFormValues) => {
        try {
            await axios.patch('/api/user/update-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Password updated successfully');
        } catch (error) {
            toast.error('Failed to update password');
        } finally {
            setIsEditingPassword(false);
        }
    };

    const handleImageUpload = async (file?: File) => {
        if (!file) return;

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.patch('/api/user/update-avatar', formData);
            if (response.status === 200) {
                const imageUrl = response.data.url;
                setPreviewImage(imageUrl);
                toast.success('Profile picture updated successfully');

                // Dispatch the updated user details to the Redux store
                dispatch(setUser({
                    ...user,
                    image: imageUrl, // Set the new image URL here
                }));
            } else {
                throw new Error('Failed to update profile picture');
            }
        } catch (error) {
            toast.error('Failed to upload profile picture');
        } finally {
            setUploadingImage(false);
            setIsFileUploadOpen(false);
        }
    };

    if (status==='loading') {
        return <UserProfileSkeleton />;
    }

    return (
        <Card className="max-w-2xl mx-auto overflow-hidden shadow-lg rounded-lg">
            <div className="w-full h-40 bg-gray-200 relative z-10">
                <Avatar
                    className="absolute bottom-0 left-6 transform translate-y-1/2 z-50 shadow-lg w-28 h-28 rounded-full border-4 border-white cursor-pointer"
                    onClick={() => setIsImageDialogOpen(true)}
                >
                    <AvatarImage src={previewImage || 'assets/avatar.jpg'} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <CardHeader className="pt-14">
                <CardTitle className="text-2xl font-semibold">{user?.name}</CardTitle>
                <p className="text-gray-500">{user?.email}</p>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <CardDescription>Role</CardDescription>
                        <Badge variant="outline" className="px-3 py-1">
                            {user?.role}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <CardDescription>Service Access</CardDescription>
                        {(user?.serviceAccessRoles || []).map((service, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <Label>{service.charAt(0).toUpperCase() + service.slice(1)}</Label>
                                <Switch checked disabled />
                            </div>
                        ))}
                        {user?.isQCallAccessible && (
                            <div className="flex items-center justify-between">
                                <Label>QCall</Label>
                                <Switch checked disabled />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end px-6 py-4">
                <ResponsiveDialogDrawer
                    isOpen={isEditingPassword}
                    onClose={() => setIsEditingPassword(false)}
                    handlePasswordChange={handlePasswordChange}
                />
            </CardFooter>

            {/* Image Preview Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent className="max-w-lg bg-white/20 backdrop-blur-md mx-auto">
                    <div className="flex flex-col items-center justify-center">
                        <Image src={previewImage || '/assets/avatar.jpg'} width={200} height={200} alt="Profile Preview" className="w-52 h-52 rounded-full mb-4 relative" />
                        <Button variant={'outline'} size={'sm'} onClick={() => setIsFileUploadOpen(true)}>
                            <Edit className='w-3 h-3' />
                            Update Profile
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* File Upload Dialog */}
            <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
                <DialogContent className="max-w-4xl mx-auto min-h-96 bg-white dark:bg-black rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Upload Profile Picture</DialogTitle>
                    </DialogHeader>
                    <FileUpload onChange={(file) => handleImageUpload(file[0])} />
                </DialogContent>
            </Dialog>
        </Card>
    );
};

const UserProfileSkeleton: React.FC = () => {
    return (
        <Card className="max-w-2xl mx-auto overflow-hidden shadow-lg rounded-lg">
            <div className="w-full h-40 bg-gray-200 relative z-10">
                <div className="absolute bottom-0 left-6 transform translate-y-1/2 z-50 shadow-lg w-28 h-28 rounded-full border-4 border-white bg-gray-300 animate-pulse"></div>
            </div>
            <CardHeader className="pt-14">
                <div className="h-6 w-1/2 bg-gray-300 mb-2 rounded animate-pulse"></div> {/* Simulate the name */}
                <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the email */}
            </CardHeader>
            <CardContent className="px-6 py-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the Role label */}
                        <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the Role badge */}
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the Service Access label */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the Service Access item */}
                                <div className="h-6 w-10 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the Switch */}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the QCall label */}
                                <div className="h-6 w-10 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the QCall Switch */}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end px-6 py-4">
                <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div> {/* Simulate the button */}
            </CardFooter>
        </Card>
    );
};

export default UserProfile;
