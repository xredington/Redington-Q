import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
    const { userId } = await req.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    try {
      const existingVisit = await prisma.userVisit.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
      });
  
      if (existingVisit) {
        return NextResponse.json({ message: 'User visit already recorded for today' });
      } else {
        await prisma.userVisit.create({
          data: {
            userId,
            date: today,
            visitCount: 1,
          },
        });
  
        return NextResponse.json({ message: 'User visit updated' });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update user visit' }, { status: 500 });
    }
  }