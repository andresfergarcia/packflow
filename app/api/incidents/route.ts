export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        machine: { select: { name: true } },
        reportedBy: { select: { name: true } },
        resolvedBy: { select: { name: true } },
      },
      take: 50,
    });
    return NextResponse.json(incidents);
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const incident = await prisma.incident.create({ data: body });
    return NextResponse.json(incident, { status: 201 });
  } catch (error: any) {
    console.error('Error creating incident:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const incident = await prisma.incident.update({ where: { id }, data });
    return NextResponse.json(incident);
  } catch (error: any) {
    console.error('Error updating incident:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
