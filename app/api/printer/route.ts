export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const configs = await prisma.printerConfig.findMany({
      orderBy: { machineId: 'asc' },
      include: { machine: { select: { name: true } } },
    });
    return NextResponse.json(configs);
  } catch (error: any) {
    console.error('Error fetching printer configs:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const config = await prisma.printerConfig.update({ where: { id }, data });
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error updating printer config:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
