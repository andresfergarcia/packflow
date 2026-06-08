export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: { role: { in: ['OPERATOR', 'TEAM_LEADER', 'MECHANIC'] } },
      select: { 
        id: true, name: true, email: true, role: true, phone: true, isActive: true,
        agencyId: true, position: true, startDate: true, skills: true,
        agency: { select: { id: true, name: true } },
        assignments: {
          where: { isActive: true },
          include: { machine: { select: { name: true, id: true } } },
          orderBy: { date: 'desc' },
          take: 1,
        },
        ratings: { orderBy: { createdAt: 'desc' }, take: 5 },
        staffIncidents: { orderBy: { createdAt: 'desc' }, take: 5 },
        _count: { select: { ratings: true, staffIncidents: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { name, email, role, phone, password, agencyId, position, skills } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    const hashedPw = await bcrypt.hash(password, 10);
    const validRoles = ['OPERATOR', 'TEAM_LEADER', 'PLANT_DIRECTOR', 'MECHANIC'];
    const userRole = validRoles.includes(role) ? role : 'OPERATOR';
    const user = await prisma.user.create({
      data: { 
        name, email, password: hashedPw, role: userRole, 
        phone: phone || null, 
        agencyId: agencyId || null,
        position: position || null,
        skills: skills || null,
      },
    });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch (error: any) {
    console.error('Staff POST error:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { id, isActive, agencyId, position, skills } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const data: any = {};
    if (isActive !== undefined) data.isActive = isActive;
    if (agencyId !== undefined) data.agencyId = agencyId;
    if (position !== undefined) data.position = position;
    if (skills !== undefined) data.skills = skills;
    
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ id: user.id, isActive: user.isActive });
  } catch (error: any) {
    console.error('Staff PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Assign staff to machine
    const body = await req.json();
    const { userId, machineId, shift, date } = body;
    
    if (!userId || !machineId || !shift) {
      return NextResponse.json({ error: 'userId, machineId, and shift are required' }, { status: 400 });
    }
    
    // Deactivate previous assignments for this user
    await prisma.staffAssignment.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
    
    // Create new assignment
    const assignment = await prisma.staffAssignment.create({
      data: {
        userId,
        machineId,
        shift,
        date: date ? new Date(date) : new Date(),
      },
    });
    
    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error('Staff PUT error:', error);
    return NextResponse.json({ error: 'Failed to assign staff' }, { status: 500 });
  }
}
