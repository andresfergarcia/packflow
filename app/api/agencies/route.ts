export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const agencies = await prisma.agency.findMany({
      include: {
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(agencies);
  } catch (error: any) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { name, contactName, contactEmail, contactPhone, address, notes } = body;
    
    if (!name) return NextResponse.json({ error: 'Agency name is required' }, { status: 400 });
    
    const agency = await prisma.agency.create({
      data: { name, contactName, contactEmail, contactPhone, address, notes },
    });
    return NextResponse.json(agency, { status: 201 });
  } catch (error: any) {
    console.error('Agency POST error:', error);
    return NextResponse.json({ error: 'Failed to create agency' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const agency = await prisma.agency.update({ where: { id }, data });
    return NextResponse.json(agency);
  } catch (error: any) {
    console.error('Agency PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update agency' }, { status: 500 });
  }
}
