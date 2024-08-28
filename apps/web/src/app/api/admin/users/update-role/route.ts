import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || (token.role.toUpperCase() !== 'SUPERADMIN' && token.role.toUpperCase() !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, role } = await req.json();

  if (!userId || !role || !Object.values(Role).includes(role)) {
    return NextResponse.json({ error: 'User ID and valid role are required' }, { status: 400 });
  }

  if (token.role === 'ADMIN' && role === 'SUPERADMIN') {
    return NextResponse.json({ error: 'Admins cannot assign super admin role' }, { status: 403 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ message: 'Role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
