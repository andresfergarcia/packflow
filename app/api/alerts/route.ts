export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      include: { machine: { select: { name: true } } },
      take: 50,
    });
    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const alert = await prisma.alert.update({
      where: { id },
      data: { status, acknowledgedAt: status === 'ACKNOWLEDGED' ? new Date() : undefined },
    });
    return NextResponse.json(alert);
  } catch (error: any) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
