import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Fetch tool usage
    const toolUsage = await prisma.toolUsage.findMany({
      where: { userId },
      orderBy: { usageCount: 'desc' },
      take: 2,
    });

    // Fetch brand usage
    const brandUsage = await prisma.brandUsage.findMany({
      where: { userId },
      orderBy: { usageCount: 'desc' },
      take: 2,
    });

    // Fetch user visits and count them by month
    const userVisits = await prisma.userVisit.findMany({
      where: { userId },
      select: {
        date: true,
      },
    });

    // Define a type for the visits by month
    type VisitsByMonth = {
      [key: string]: number;
    };

    // Helper to get month name
    const getMonthName = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    };

    // Initialize all months with 0 visits
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const visitsByMonth: VisitsByMonth = allMonths.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {} as VisitsByMonth);

    // Aggregate visits by month
    userVisits.forEach(visit => {
      const monthName = getMonthName(new Date(visit.date));
      visitsByMonth[monthName]!++;
    });

    const totalVisits = Object.values(visitsByMonth).reduce((acc, visits) => acc + visits, 0);
    const maxVisits = Math.max(...Object.values(visitsByMonth));
    const yAxisUpperBound = Math.ceil(maxVisits * 1.2);

    return NextResponse.json({
      toolUsage,
      brandUsage,
      visitsByMonth,
      totalVisits,
      yAxisUpperBound,
    });
  } catch (error) {
    console.error('Failed to fetch user analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch user analytics' }, { status: 500 });
  }
}
