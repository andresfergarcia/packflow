export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const cards = await prisma.productCard.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, sku: true } },
        machine: { select: { name: true } },
      },
    });
    return NextResponse.json(cards);
  } catch (error: any) {
    console.error('ProductCard GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { productId, machineId, dimensions, nozzleType, nozzleSize, glueAmount, glueTemp, printerPos, printerSpeed, filmType, boxType, notes } = body;
    if (!productId || !machineId) return NextResponse.json({ error: 'Product and machine are required' }, { status: 400 });
    const card = await prisma.productCard.upsert({
      where: { productId_machineId: { productId, machineId } },
      update: { dimensions, nozzleType, nozzleSize, glueAmount: glueAmount ? parseFloat(glueAmount) : null, glueTemp: glueTemp ? parseFloat(glueTemp) : null, printerPos, printerSpeed: printerSpeed ? parseFloat(printerSpeed) : null, filmType, boxType, notes },
      create: { productId, machineId, dimensions, nozzleType, nozzleSize, glueAmount: glueAmount ? parseFloat(glueAmount) : null, glueTemp: glueTemp ? parseFloat(glueTemp) : null, printerPos, printerSpeed: printerSpeed ? parseFloat(printerSpeed) : null, filmType, boxType, notes },
      include: { product: { select: { name: true } }, machine: { select: { name: true } } },
    });
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    console.error('ProductCard POST error:', error);
    return NextResponse.json({ error: 'Failed to save product card' }, { status: 500 });
  }
}
