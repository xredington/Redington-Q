import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = token.role.toLowerCase(); // Normalize role to lowercase

  if (role !== 'superadmin' && role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const roleFilter = role === 'superadmin' ? {} : {
    role: {
      in: [Role.ADMIN, Role.USER], // Fetch only admins and users if the role is 'admin'
    },
  };

  try {
    const users = await prisma.user.findMany({
      where: roleFilter,
      orderBy: { createdAt: 'desc' },
      include: {
        serviceAccessRoles: {
          include: {
            brand: true, // Include the related brand information
          },
        },
      },
    });

    const usersWithServiceAccess = users.map(user => ({
      ...user,
      serviceAccessRoles: user.serviceAccessRoles.map(role => role.brand.name), // Map to get brand names
      isServiceAccessible: user.serviceAccessRoles.length > 0, // Determine if service access is available
    }));

    return NextResponse.json(usersWithServiceAccess);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
