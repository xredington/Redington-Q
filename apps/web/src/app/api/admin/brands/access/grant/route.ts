import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
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

    // Create the service access role using the brand ID
    const serviceAccessRole = await prisma.serviceAccessRole.create({
      data: {
        userId,
        brandId: brand.id,
      },
    });

    return NextResponse.json(serviceAccessRole, { status: 201 });
  } catch (error) {
    console.error('Failed to grant brand access:', error);
    return NextResponse.json({ error: 'Failed to grant brand access' }, { status: 500 });
  }
}
