import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';

const AdminDashboardSkeleton: React.FC = () => {
    return (
        <Card className="flex-grow mt-8">
            <CardHeader>
                <div className="h-6 w-1/3 bg-gray-300 rounded animate-pulse mb-2"></div> {/* Simulate CardTitle */}
                <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div> {/* Simulate CardDescription */}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableHead key={index}>
                                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div> {/* Simulate Table Headers */}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: 5 }).map((_, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <div className="h-6 bg-gray-300 rounded animate-pulse"></div> {/* Simulate Table Cells */}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="h-6 w-1/3 bg-gray-300 rounded animate-pulse"></div> {/* Simulate Pagination */}
                <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div> {/* Simulate Pagination Info */}
            </CardFooter>
        </Card>
    );
};

export default AdminDashboardSkeleton;
