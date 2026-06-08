export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const pallets = await prisma.pallet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        machine: { select: { name: true } },
        product: { select: { name: true } },
      },
      take: 50,
    });
    return NextResponse.json(pallets);
  } catch (error: any) {
    console.error('Error fetching pallets:', error);
    return NextResponse.json([], { status: 500 });
  }
}
