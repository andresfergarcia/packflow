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
    
    const ratings = await prisma.staffRating.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(ratings);
  } catch (error: any) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { userId, score, strengths, notes, shift } = body;
    
    if (!userId || !score) {
      return NextResponse.json({ error: 'userId and score are required' }, { status: 400 });
    }
    if (score < 1 || score > 5) {
      return NextResponse.json({ error: 'Score must be between 1 and 5' }, { status: 400 });
    }
    
    const rating = await prisma.staffRating.create({
      data: {
        userId,
        ratedById: (session.user as any).id,
        score,
        strengths,
        notes,
        shift,
      },
    });
    return NextResponse.json(rating, { status: 201 });
  } catch (error: any) {
    console.error('Rating POST error:', error);
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
  }
}
