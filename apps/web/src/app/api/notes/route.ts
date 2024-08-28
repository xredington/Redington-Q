import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const canvas = await prisma.note.findFirst({
      where: { userId },
    });

    if (!canvas) {
      return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
    }

    return NextResponse.json(canvas);
  } catch (error) {
    console.error('Error fetching canvas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
    try {
      const { userId, document } = await req.json();
  
      if (!userId || !document) {
        return NextResponse.json({ error: 'Missing userId or document' }, { status: 400 });
      }
  
      const canvas = await prisma.note.upsert({
        where: { userId },
        update: { document },
        create: { userId, document },
      });
  
      return NextResponse.json(canvas);
    } catch (error) {
      console.error('Error updating canvas:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  