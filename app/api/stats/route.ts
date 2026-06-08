export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [machines, activeAlerts, openIncidents, pallets, waste, todayLogs] = await Promise.all([
      prisma.machine.findMany(),
      prisma.alert.count({ where: { status: 'ACTIVE' } }),
      prisma.incident.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } } }),
      prisma.pallet.findMany({ where: { status: { in: ['IN_PROGRESS', 'COMPLETED'] } } }),
      prisma.wasteEntry.findMany(),
      prisma.productionLog.findMany({
        where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
      }),
    ]);

    const runningMachines = machines?.filter?.((m: any) => m?.status === 'RUNNING')?.length ?? 0;
    const totalMachines = machines?.length ?? 0;
    const avgOee = machines?.length ? machines.reduce((s: number, m: any) => s + (m?.oee ?? 0), 0) / machines.length : 0;
    const totalProduced = machines?.reduce?.((s: number, m: any) => s + (m?.dailyProduced ?? 0), 0) ?? 0;
    const totalTarget = machines?.reduce?.((s: number, m: any) => s + (m?.dailyTarget ?? 0), 0) ?? 0;
    const totalWaste = waste?.reduce?.((s: number, w: any) => s + (w?.quantity ?? 0), 0) ?? 0;
    const completedPallets = pallets?.filter?.((p: any) => p?.status === 'COMPLETED')?.length ?? 0;

    return NextResponse.json({
      runningMachines,
      totalMachines,
      avgOee: Number(avgOee?.toFixed?.(1) ?? 0),
      totalProduced,
      totalTarget,
      activeAlerts,
      openIncidents,
      completedPallets,
      inProgressPallets: (pallets?.length ?? 0) - completedPallets,
      totalWaste: Number(totalWaste?.toFixed?.(1) ?? 0),
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({}, { status: 500 });
  }
}
