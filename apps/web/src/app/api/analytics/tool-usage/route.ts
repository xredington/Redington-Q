import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
    const { userId, toolName } = await req.json();
  
    try {
      await prisma.toolUsage.upsert({
        where: {
          userId_toolName: {
            userId,
            toolName,
          },
        },
        update: {
          usageCount: {
            increment: 1,
          },
        },
        create: {
          userId,
          toolName,
          usageCount: 1,
        },
      });
  
      return NextResponse.json({ message: 'Tool usage updated' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update tool usage' }, { status: 500 });
    }
  }