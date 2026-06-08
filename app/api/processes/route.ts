export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const processes = await prisma.process.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(processes);
  } catch (error: any) {
    console.error('Process GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch processes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { name, description, category, steps } = body;
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    const process = await prisma.process.create({ data: { name, description, category, steps } });
    return NextResponse.json(process, { status: 201 });
  } catch (error: any) {
    console.error('Process POST error:', error);
    return NextResponse.json({ error: 'Failed to create process' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const process = await prisma.process.update({ where: { id }, data });
    return NextResponse.json(process);
  } catch (error: any) {
    console.error('Process PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update process' }, { status: 500 });
  }
}
