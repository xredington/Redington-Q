import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || (token.role !== 'ADMIN' && token.role !== 'SUPERADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, brandName } = await req.json();

  if (!userId || !brandName) {
    return NextResponse.json({ error: 'User ID and Brand Name are required' }, { status: 400 });
  }

  try {
    // Fetch the brand by its name
    const brand = await prisma.brand.findUnique({
      where: { name: brandName.toLowerCase() },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Delete the service access role using the brand ID
    await prisma.serviceAccessRole.delete({
      where: {
        userId_brandId: {
          userId,
          brandId: brand.id,
        },
      },
    });

    return NextResponse.json({ message: 'Brand access revoked' }, { status: 200 });
  } catch (error) {
    console.error('Failed to revoke brand access:', error);
    return NextResponse.json({ error: 'Failed to revoke brand access' }, { status: 500 });
  }
}
