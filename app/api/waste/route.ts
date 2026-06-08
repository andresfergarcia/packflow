export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const waste = await prisma.wasteEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        machine: { select: { name: true } },
        user: { select: { name: true } },
      },
      take: 50,
    });
    return NextResponse.json(waste);
  } catch (error: any) {
    console.error('Error fetching waste:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = await prisma.wasteEntry.create({ data: body });
    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating waste entry:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
