"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Button } from '@repo/ui/components/ui/button';
import { Switch } from '@repo/ui/components/ui/switch';
import { Badge } from '@repo/ui/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/ui/avatar';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@repo/ui/components/ui/pagination';
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    flexRender,
    getFilteredRowModel
} from '@tanstack/react-table';
import { DrawerDialog } from './DrawerDialog';
import AdminDashboardSkeleton from '@/components/loaders/AdminDashboardSkeleton';
import { Input } from '@repo/ui/components/ui/input';
import { useDebounce } from '@/hooks/use-debouce';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'SUPERADMIN' | 'ADMIN' | 'USER';
    approved: boolean;
    createdAt: string;
    image: string | null;
    serviceAccessRoles: ('aruba' | 'fortinet' | 'hp' | 'huawei')[];
    isQCallAccessible: boolean;
};

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');

    const debouncedGlobalFilter = useDebounce(globalFilter, 500);

    useEffect(() => {
        const fetchUsers = async () => {
            if (status === 'authenticated' && session) {
                try {
                    const response = await axios.get('/api/admin/users');
                    setUsers(response.data);
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                    toast.error('Failed to fetch users');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUsers();
    }, [session, status, toast]);

    const handleGrantBrandAccess = async (userId: string, brandName: "aruba" | "fortinet" | "hp" | "huawei") => {
        try {
            await axios.patch('/api/admin/brands/access/grant', { userId, brandName: brandName });
            toast.success(`Granted access to ${brandName}`);
        } catch (error) {
            console.error(`Failed to grant access to ${brandName}:`, error);
            toast.error(`Failed to grant access to ${brandName}`);
        }
    };

    const handleRevokeBrandAccess = async (userId: string, brandName: string) => {
        try {
            await axios.delete('/api/admin/brands/access/revoke', {
                data: { userId, brandName } // Pass data under 'data' key
            });
            toast.success(`Revoked access to ${brandName}`);
        } catch (error) {
            console.error(`Failed to revoke access to ${brandName}:`, error);
            toast.error(`Failed to revoke access to ${brandName}`);
        }
    };

    const handleUpdateQCallAccess = async (userId: string, isQCallAccessible: boolean) => {
        try {
            await axios.patch('/api/admin/users/approve-qcall-access', { userId, isQCallAccessible });
            toast.success('QCall access updated');
        } catch (error) {
            console.error('Failed to update QCall access:', error);
            toast.error('Failed to update QCall access');
        }
    };

    const handleUpdateRole = async (userId: string, role: 'SUPERADMIN' | 'ADMIN' | 'USER') => {
        try {
            await axios.patch('/api/admin/users/update-role', { userId, role });
            setUsers(users.map((user) => (user.id === userId ? { ...user, role } : user)));
            toast.success('Role updated successfully');
        } catch (error) {
            console.error('Failed to update role:', error);
            toast.error('Failed to update role');
        }
    };

    const handleApprovalChange = async (userId: string, approved: boolean) => {
        try {
            const response = await axios.patch('/api/admin/users/approve-user', { userId, approved });
            const updatedUser = response.data.user;

            setUsers(prevUsers =>
                prevUsers.map(user => (user.id === userId ? updatedUser : user))
            );
            toast.success('User approval status updated');
        } catch (error) {
            console.error('Failed to update user approval status:', error);
            toast.error('Failed to update user approval status');
        }
    };

    const handleChangePassword = async (userId: string, newPassword: string) => {
        try {
            await axios.patch('/api/admin/users/change-password', { userId, newPassword });
            toast.success('Password updated successfully');
        } catch (error) {
            console.error('Failed to update password:', error);
            toast.error('Failed to update password');
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'image',
            header: 'Avatar',
            cell: ({ row }) => (
                <Avatar>
                    <AvatarImage src={row.original.image || 'assets/avatar.jpg'} />
                    <AvatarFallback>{row.original.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <div>{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => (
                <Badge variant={row.getValue('role') === 'user' ? 'outline' : 'secondary'}>
                    {row.getValue('role')}
                </Badge>
            ),
        },
        {
            accessorKey: 'approved',
            header: 'Approved',
            cell: ({ row }) => (
                <Switch
                    checked={!!row.getValue('approved')}
                    onCheckedChange={(value) => handleApprovalChange(row.original.id, !!value)}
                />
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DrawerDialog
                    user={row.original}
                    handleUpdateRole={handleUpdateRole}
                    handleChangePassword={handleChangePassword}
                    handleGrantBrandAccess={handleGrantBrandAccess}
                    handleRevokeBrandAccess={handleRevokeBrandAccess}
                    handleUpdateQCallAccess={handleUpdateQCallAccess}
                />
            ),
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { globalFilter: debouncedGlobalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, value) => {
            return (row.getValue(columnId) as string)?.toLowerCase().includes(value.toLowerCase());
        },
    });

    if (loading) {
        return <AdminDashboardSkeleton />;
    }

    return (
        <Card className="flex-grow mt-8">
            <CardHeader>
                <CardTitle>Admin Control Center</CardTitle>
                <CardDescription>Oversee and manage user roles, access, and more</CardDescription>
                <div className="mt-4 w-full max-w-sm">
                    <Input
                        placeholder="Search Inside the table..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => table.previousPage()} isActive={table.getCanPreviousPage()} />
                        </PaginationItem>
                        {Array.from({ length: table.getPageCount() }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    onClick={() => table.setPageIndex(i)}
                                    isActive={table.getState().pagination.pageIndex === i}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={() => table.nextPage()} isActive={table.getCanNextPage()} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong> pages
                </div>
            </CardFooter>
        </Card>
    );
};

export default AdminDashboard;
