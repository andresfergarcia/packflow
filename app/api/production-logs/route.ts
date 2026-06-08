export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const logs = await prisma.productionLog.findMany({
      orderBy: { date: 'desc' },
      include: { machine: { select: { name: true } } },
      take: 210,
    });
    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('Error fetching production logs:', error);
    return NextResponse.json([], { status: 500 });
  }
}
