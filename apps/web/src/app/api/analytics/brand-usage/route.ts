import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
  const { userId, brandName } = await req.json();

  try {
    await prisma.brandUsage.upsert({
      where: {
        userId_brandName: {
          userId,
          brandName,
        },
      },
      update: {
        usageCount: {
          increment: 1,
        },
      },
      create: {
        userId,
        brandName,
        usageCount: 1,
      },
    });

    return NextResponse.json({ message: 'Brand usage updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update brand usage' }, { status: 500 });
  }
}
