export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    const where: any = {};
    if (userId) where.userId = userId;
    
    const incidents = await prisma.staffIncident.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(incidents);
  } catch (error: any) {
    console.error('Error fetching staff incidents:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { userId, title, description, severity } = body;
    
    if (!userId || !title || !description) {
      return NextResponse.json({ error: 'userId, title, and description are required' }, { status: 400 });
    }
    
    const incident = await prisma.staffIncident.create({
      data: {
        userId,
        reportedById: (session.user as any).id,
        title,
        description,
        severity: severity || 'MEDIUM',
      },
    });
    return NextResponse.json(incident, { status: 201 });
  } catch (error: any) {
    console.error('Staff incident POST error:', error);
    return NextResponse.json({ error: 'Failed to create staff incident' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { id, resolved, resolution } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const incident = await prisma.staffIncident.update({
      where: { id },
      data: {
        resolved,
        resolution,
        resolvedAt: resolved ? new Date() : null,
      },
    });
    return NextResponse.json(incident);
  } catch (error: any) {
    console.error('Staff incident PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update staff incident' }, { status: 500 });
  }
}
