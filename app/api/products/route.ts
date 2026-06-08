export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        productCards: {
          include: { machine: { select: { name: true } } },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { name, sku, ean, category, description } = body;
    if (!name || !sku || !category) return NextResponse.json({ error: 'Name, SKU, and category are required' }, { status: 400 });
    const product = await prisma.product.create({
      data: { name, sku, ean: ean || null, category, description: description || null },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
