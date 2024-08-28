import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@repo/ui/components/ui/drawer';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Switch } from '@repo/ui/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { Edit } from 'lucide-react';
import { useMediaQuery } from '../../hooks/use-media-query';
import { toast } from 'sonner';

type DrawerDialogProps = {
    user: {
        id: string;
        role: 'SUPERADMIN' | 'ADMIN' | 'USER';
        name: string;
        email: string;
        image: string | null;
        serviceAccessRoles: ('aruba' | 'fortinet' | 'hp' | 'huawei')[];
        isQCallAccessible: boolean;
    };
    handleUpdateRole: (userId: string, role: 'SUPERADMIN' | 'ADMIN' | 'USER') => void;
    handleChangePassword: (userId: string, newPassword: string) => void;
    handleGrantBrandAccess: (userId: string, brand: 'aruba' | 'fortinet' | 'hp' | 'huawei') => void;
    handleRevokeBrandAccess: (userId: string, brand: 'aruba' | 'fortinet' | 'hp' | 'huawei') => void;
    handleUpdateQCallAccess: (userId: string, isQCallAccessible: boolean) => void;
};

const BRANDS = ['aruba', 'fortinet', 'hp', 'huawei'] as const;

const userFormSchema = z.object({
    role: z.enum(['SUPERADMIN', 'ADMIN', 'USER']).optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long').optional().or(z.literal('')),
    brandAccess: z.array(z.enum(BRANDS)).optional(),
    isQCallAccessible: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export const DrawerDialog: React.FC<DrawerDialogProps> = ({
    user,
    handleUpdateRole,
    handleChangePassword,
    handleGrantBrandAccess,
    handleRevokeBrandAccess,
    handleUpdateQCallAccess,
}) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            role: user.role,
            brandAccess: user.serviceAccessRoles || [],
            isQCallAccessible: user.isQCallAccessible,
        },
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            if (data.role && data.role !== user.role) {
                await handleUpdateRole(user.id, data.role);
            }
            if (data.newPassword && data.newPassword.trim() !== '') {
                await handleChangePassword(user.id, data.newPassword);
            }
            if (data.brandAccess) {
                BRANDS.forEach(async (brand) => {
                    if (data.brandAccess?.includes(brand) && !user.serviceAccessRoles?.includes(brand)) {
                        await handleGrantBrandAccess(user.id, brand);
                    } else if (!data.brandAccess?.includes(brand) && user.serviceAccessRoles?.includes(brand)) {
                        await handleRevokeBrandAccess(user.id, brand);
                    }
                });
            }
            if (data.isQCallAccessible !== undefined && data.isQCallAccessible !== user.isQCallAccessible) {
                await handleUpdateQCallAccess(user.id, data.isQCallAccessible);
            }
            toast.success('User updated successfully');
        } catch (error) {
            toast.error('Failed to update user');
        } finally {
            setOpen(false);
        }
    };

    const Form = (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setValue('role', value as UserFormValues['role'])} defaultValue={user.role}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && <span className="text-red-600">{errors.role.message}</span>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    placeholder="Enter new password"
                />
                {errors.newPassword && <span className="text-red-600">{errors.newPassword.message}</span>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="brandAccess">Brand Access</Label>
                {BRANDS.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                        <Switch
                            checked={watch('brandAccess', [])?.includes(brand)}
                            onCheckedChange={() => {
                                const currentBrands = watch('brandAccess', []);
                                if (currentBrands?.includes(brand)) {
                                    setValue('brandAccess', currentBrands.filter(b => b !== brand));
                                } else {
                                    setValue('brandAccess', [...currentBrands!, brand]);
                                }
                            }}
                        />
                        <Label>{brand.charAt(0).toUpperCase() + brand.slice(1)}</Label>
                    </div>
                ))}
                {errors.brandAccess && <span className="text-red-600">{errors.brandAccess.message}</span>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="qcall">QCall Access</Label>
                <Switch
                    {...register('isQCallAccessible')}
                    checked={watch('isQCallAccessible')}
                    onCheckedChange={(value) => setValue('isQCallAccessible', value)}
                />
                {errors.isQCallAccessible && <span className="text-red-600">{errors.isQCallAccessible.message}</span>}
            </div>
            <Button type="submit">Save changes</Button>
        </form>
    );

    const UserDetails = (
        <div className="grid gap-4 mb-4">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={user.image || 'https://github.com/shadcn.png'} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user's role, password, and service access here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {UserDetails}
                    {Form}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit User</DrawerTitle>
                    <DrawerDescription>
                        Make changes to the user's role, password, and service access here. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                {UserDetails}
                {Form}
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
