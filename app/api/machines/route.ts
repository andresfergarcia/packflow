export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const machines = await prisma.machine.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { incidents: { where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } } }, alerts: { where: { status: 'ACTIVE' } } } },
      },
    });
    return NextResponse.json(machines);
  } catch (error: any) {
    console.error('Error fetching machines:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { name, model, type, location, dailyTarget } = body;
    if (!name || !model || !type) return NextResponse.json({ error: 'Name, model, and type are required' }, { status: 400 });
    const machine = await prisma.machine.create({
      data: { name, model, type, location: location || null, dailyTarget: dailyTarget || 0, status: 'IDLE' },
    });
    return NextResponse.json(machine, { status: 201 });
  } catch (error: any) {
    console.error('Machine POST error:', error);
    return NextResponse.json({ error: 'Failed to create machine' }, { status: 500 });
  }
}
