import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || (token.role !== 'SUPERADMIN' && token.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, isQCallAccessible } = await req.json();

  if (!userId || typeof isQCallAccessible !== 'boolean') {
    return NextResponse.json({ error: 'User ID and QCall access status are required' }, { status: 400 });
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (token.role === 'ADMIN' && targetUser.role === 'SUPERADMIN') {
      return NextResponse.json({ error: 'Admins cannot modify QCall access for superadmins' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isQCallAccessible },
    });

    return NextResponse.json({ message: 'User QCall access updated', user: updatedUser });
  } catch (error) {
    console.error('Failed to update QCall access:', error);
    return NextResponse.json({ error: 'Failed to update QCall access' }, { status: 500 });
  }
}
