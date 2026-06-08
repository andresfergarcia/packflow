export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const reports = await prisma.maintenanceReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        machine: { select: { name: true, location: true } },
        mechanic: { select: { name: true } },
      },
    });
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Maintenance GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { machineId, type, title, description, partsChanged, partsUsed, timeSpentMin, laborCost, partsCost, incidentId } = body;
    if (!machineId || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const report = await prisma.maintenanceReport.create({
      data: {
        machineId,
        mechanicId: (session.user as any).id,
        type: type || 'REPAIR',
        title,
        description,
        partsChanged: partsChanged || null,
        partsUsed: partsUsed || null,
        timeSpentMin: timeSpentMin || 0,
        laborCost: laborCost || 0,
        partsCost: partsCost || 0,
        incidentId: incidentId || null,
        status: 'COMPLETED',
      },
      include: {
        machine: { select: { name: true } },
        mechanic: { select: { name: true } },
      },
    });
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Maintenance POST error:', error);
    return NextResponse.json({ error: 'Failed to create maintenance report' }, { status: 500 });
  }
}
