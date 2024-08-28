import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || (token.role !== 'SUPERADMIN' && token.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, approved } = await req.json();

  if (!userId || typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'User ID and approval status are required' }, { status: 400 });
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (token.role === 'ADMIN' && targetUser.role === 'SUPERADMIN') {
      return NextResponse.json({ error: 'Admins cannot approve or disapprove super admins' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { approved },
    });

    return NextResponse.json({ message: 'User approval status updated', user: updatedUser });
  } catch (error) {
    console.error('Failed to update approval status:', error);
    return NextResponse.json({ error: 'Failed to update approval status' }, { status: 500 });
  }
}
