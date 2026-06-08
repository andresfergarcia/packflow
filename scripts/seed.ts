import { PrismaClient, Role, MachineStatus, ShiftType, AlertSeverity, AlertStatus, IncidentStatus, IncidentPriority, PalletStatus, MaintenanceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PackFlow database...');

  // Users - Standard passwords for easy testing
  const directorPw = await bcrypt.hash('director123', 10);
  const leaderPw = await bcrypt.hash('leader123', 10);
  const operatorPw = await bcrypt.hash('operator123', 10);
  const testPw = await bcrypt.hash('johndoe123', 10);
  const users = [
    { id: 'user-test-admin', name: 'Test Admin', email: 'john@doe.com', password: testPw, role: Role.PLANT_DIRECTOR, phone: '+48 600 000 000' },
    { id: 'user-director-1', name: 'Jan Kowalski', email: 'director@marba.pl', password: directorPw, role: Role.PLANT_DIRECTOR, phone: '+48 601 234 567' },
    { id: 'user-leader-1', name: 'Anna Nowak', email: 'leader1@marba.pl', password: leaderPw, role: Role.TEAM_LEADER, phone: '+48 602 345 678' },
    { id: 'user-leader-2', name: 'Piotr Wiśniewski', email: 'leader2@marba.pl', password: leaderPw, role: Role.TEAM_LEADER, phone: '+48 603 456 789' },
    { id: 'user-op-1', name: 'Marek Zieliński', email: 'operator1@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 604 567 890' },
    { id: 'user-op-2', name: 'Katarzyna Wójcik', email: 'operator2@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 605 678 901' },
    { id: 'user-op-3', name: 'Tomasz Kamiński', email: 'operator3@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 606 789 012' },
    { id: 'user-op-4', name: 'Agnieszka Lewandowska', email: 'operator4@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 607 890 123' },
    { id: 'user-op-5', name: 'Michał Dąbrowski', email: 'operator5@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 608 901 234' },
    { id: 'user-op-6', name: 'Ewa Szymańska', email: 'operator6@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 609 012 345' },
    { id: 'user-op-7', name: 'Robert Woźniak', email: 'operator7@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 610 123 456' },
    { id: 'user-op-8', name: 'Monika Kozłowska', email: 'operator8@marba.pl', password: operatorPw, role: Role.OPERATOR, phone: '+48 611 234 567' },
    // Mechanics
    { id: 'user-mech-1', name: 'Stanisław Nowicki', email: 'mechanic1@marba.pl', password: await bcrypt.hash('mechanic123', 10), role: Role.MECHANIC, phone: '+48 620 111 222' },
    { id: 'user-mech-2', name: 'Paweł Grabowski', email: 'mechanic2@marba.pl', password: await bcrypt.hash('mechanic123', 10), role: Role.MECHANIC, phone: '+48 620 222 333' },
    { id: 'user-mech-3', name: 'Łukasz Pawlak', email: 'mechanic3@marba.pl', password: await bcrypt.hash('mechanic123', 10), role: Role.MECHANIC, phone: '+48 620 333 444' },
    { id: 'user-mech-4', name: 'Krzysztof Michalski', email: 'mechanic4@marba.pl', password: await bcrypt.hash('mechanic123', 10), role: Role.MECHANIC, phone: '+48 620 444 555' },
    { id: 'user-mech-5', name: 'Damian Król', email: 'mechanic5@marba.pl', password: await bcrypt.hash('mechanic123', 10), role: Role.MECHANIC, phone: '+48 620 555 666' },
    { id: 'user-mech-6', name: 'Grzegorz Mazur', email: 'mechanic6@marba.pl', password: await bcrypt.hash('mechanic123', 10), role: Role.MECHANIC, phone: '+48 620 666 777' },
  ];

  for (const u of users) {
    await prisma.user.upsert({ where: { id: u.id }, update: { name: u.name, email: u.email, password: u.password, role: u.role, phone: u.phone }, create: u });
  }
  console.log('Users seeded');

  // Machines
  const machines = [
    { id: 'mach-1', name: 'Betti 1', model: 'NB/85/28-WSM-SX', type: 'Packaging', status: MachineStatus.RUNNING, currentProduct: 'OXO Dishwasher Tabs 40pc', dailyTarget: 1200, dailyProduced: 847, oee: 82.5, uptime: 94.2, speed: 120, location: 'Hall A - Line 1' },
    { id: 'mach-2', name: 'Betti 2', model: 'NB/85/28-WSM-SX', type: 'Packaging', status: MachineStatus.RUNNING, currentProduct: 'Marseille Soap 200g', dailyTarget: 1000, dailyProduced: 623, oee: 78.3, uptime: 91.0, speed: 105, location: 'Hall A - Line 2' },
    { id: 'mach-3', name: 'IARO-70', model: 'Vertical Packaging Machine', type: 'Vertical Packaging', status: MachineStatus.STOPPED, currentProduct: 'Descaler Powder 500g', dailyTarget: 800, dailyProduced: 412, oee: 65.0, uptime: 78.5, speed: 0, location: 'Hall A - Line 3' },
    { id: 'mach-4', name: 'ISHIDA 1', model: 'Weight Dosing System', type: 'Weight Dosing', status: MachineStatus.RUNNING, currentProduct: 'Toilet Tablets 8pc', dailyTarget: 1500, dailyProduced: 1102, oee: 88.0, uptime: 96.1, speed: 150, location: 'Hall B - Line 1' },
    { id: 'mach-5', name: 'ISHIDA 2', model: 'Weight Dosing System', type: 'Weight Dosing', status: MachineStatus.RUNNING, currentProduct: 'Laundry Soap Flakes 1kg', dailyTarget: 1400, dailyProduced: 980, oee: 85.2, uptime: 93.8, speed: 140, location: 'Hall B - Line 2' },
    { id: 'mach-6', name: 'Eurotap', model: 'Eurotap Tableting', type: 'Tableting', status: MachineStatus.MAINTENANCE, currentProduct: null, dailyTarget: 2000, dailyProduced: 0, oee: 0, uptime: 0, speed: 0, location: 'Hall C - Line 1' },
    { id: 'mach-7', name: 'Killian 1', model: 'KTS 840', type: 'Rotary Press', status: MachineStatus.RUNNING, currentProduct: 'WC Block Lemon 50g', dailyTarget: 1800, dailyProduced: 1345, oee: 91.2, uptime: 97.5, speed: 180, location: 'Hall C - Line 2' },
    { id: 'mach-8', name: 'Killian 2', model: 'KTS 1000', type: 'Rotary Press', status: MachineStatus.RUNNING, currentProduct: 'Dishwasher Salt Tabs', dailyTarget: 1600, dailyProduced: 1210, oee: 86.7, uptime: 95.3, speed: 165, location: 'Hall C - Line 3' },
    { id: 'mach-9', name: 'UNILINE TA', model: 'Packaging Line', type: 'Packaging Line', status: MachineStatus.IDLE, currentProduct: null, dailyTarget: 900, dailyProduced: 0, oee: 0, uptime: 100, speed: 0, location: 'Hall D - Line 1' },
    { id: 'mach-10', name: 'Coffee Service', model: 'Type 1000', type: 'Coffee Packaging', status: MachineStatus.RUNNING, currentProduct: 'Stain Remover Tabs', dailyTarget: 1100, dailyProduced: 756, oee: 79.5, uptime: 89.4, speed: 110, location: 'Hall D - Line 2' },
  ];

  for (const m of machines) {
    await prisma.machine.upsert({ where: { name: m.name }, update: { ...m, id: undefined, name: undefined }, create: m });
  }
  console.log('Machines seeded');

  // Products
  const products = [
    { id: 'prod-1', name: 'OXO Dishwasher Tablets 40pc', sku: 'OXO-DW-40', ean: '5901234567001', category: 'Dishwasher', description: 'All-in-one dishwasher tablets, 40 pieces per box' },
    { id: 'prod-2', name: 'Marseille Soap 200g', sku: 'MRS-200', ean: '5901234567002', category: 'Laundry', description: 'Traditional Marseille laundry soap bar' },
    { id: 'prod-3', name: 'Descaler Powder 500g', sku: 'DSC-500', ean: '5901234567003', category: 'Descaling', description: 'Universal descaling powder for kettles and machines' },
    { id: 'prod-4', name: 'Toilet Tablets 8pc', sku: 'TLT-8', ean: '5901234567004', category: 'Toilet', description: 'WC cleaning tablets, 8 per pack' },
    { id: 'prod-5', name: 'Laundry Soap Flakes 1kg', sku: 'LSF-1000', ean: '5901234567005', category: 'Laundry', description: 'Pure laundry soap flakes for sensitive fabrics' },
    { id: 'prod-6', name: 'WC Block Lemon 50g', sku: 'WCB-L50', ean: '5901234567006', category: 'Toilet', description: 'Lemon-scented WC rim block' },
    { id: 'prod-7', name: 'Dishwasher Salt Tabs', sku: 'DST-30', ean: '5901234567007', category: 'Dishwasher', description: 'Water softener salt tablets for dishwashers' },
    { id: 'prod-8', name: 'Stain Remover Tabs', sku: 'SRT-12', ean: '5901234567008', category: 'Laundry', description: 'Oxygen-based stain remover tablets' },
    { id: 'prod-9', name: 'Kettle Descaler 3pk', sku: 'KTD-3', ean: '5901234567009', category: 'Descaling', description: 'Kettle descaler sachets, 3 pack' },
    { id: 'prod-10', name: 'WC Freshener Ocean', sku: 'WCF-O35', ean: '5901234567010', category: 'Toilet', description: 'Ocean-scented toilet freshener block' },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { sku: p.sku }, update: { name: p.name, category: p.category, description: p.description }, create: p });
  }
  console.log('Products seeded');

  // Product Cards
  const productCards = [
    { id: 'pc-1', productId: 'prod-1', machineId: 'mach-1', dimensions: '120x80x45mm', nozzleType: 'Type A', nozzleSize: '12mm', glueAmount: 2.5, glueTemp: 165, printerPos: 'Position 3', printerSpeed: 2.0, filmType: 'PE 30μm', boxType: 'Cardboard E-flute' },
    { id: 'pc-2', productId: 'prod-2', machineId: 'mach-2', dimensions: '95x65x35mm', nozzleType: 'Type B', nozzleSize: '10mm', glueAmount: 1.8, glueTemp: 155, printerPos: 'Position 2', printerSpeed: 1.8, filmType: 'OPP 25μm', boxType: 'Paper wrap' },
    { id: 'pc-3', productId: 'prod-3', machineId: 'mach-3', dimensions: '180x120x60mm', nozzleType: 'Type C', nozzleSize: '15mm', glueAmount: 3.0, glueTemp: 170, printerPos: 'Position 1', printerSpeed: 1.5, filmType: 'LDPE 40μm', boxType: 'Stand-up pouch' },
    { id: 'pc-4', productId: 'prod-4', machineId: 'mach-4', dimensions: '140x100x50mm', nozzleType: 'Type A', nozzleSize: '12mm', glueAmount: 2.2, glueTemp: 160, printerPos: 'Position 3', printerSpeed: 2.5, filmType: 'PE 30μm', boxType: 'Cardboard B-flute' },
    { id: 'pc-5', productId: 'prod-5', machineId: 'mach-5', dimensions: '250x180x80mm', nozzleType: 'Type D', nozzleSize: '18mm', glueAmount: 4.0, glueTemp: 175, printerPos: 'Position 2', printerSpeed: 1.2, filmType: 'HDPE 50μm', boxType: 'Bag-in-box' },
    { id: 'pc-6', productId: 'prod-6', machineId: 'mach-7', dimensions: '60x60x30mm', nozzleType: 'Type E', nozzleSize: '8mm', glueAmount: 1.0, glueTemp: 150, printerPos: 'Position 1', printerSpeed: 3.0, filmType: 'PVC shrink', boxType: 'Blister pack' },
    { id: 'pc-7', productId: 'prod-7', machineId: 'mach-8', dimensions: '160x110x55mm', nozzleType: 'Type A', nozzleSize: '12mm', glueAmount: 2.8, glueTemp: 165, printerPos: 'Position 3', printerSpeed: 2.2, filmType: 'PE 35μm', boxType: 'Cardboard E-flute' },
    { id: 'pc-8', productId: 'prod-8', machineId: 'mach-10', dimensions: '130x90x45mm', nozzleType: 'Type B', nozzleSize: '10mm', glueAmount: 2.0, glueTemp: 158, printerPos: 'Position 2', printerSpeed: 1.8, filmType: 'OPP 28μm', boxType: 'Cardboard E-flute' },
  ];

  for (const pc of productCards) {
    await prisma.productCard.upsert({ where: { productId_machineId: { productId: pc.productId, machineId: pc.machineId } }, update: { ...pc, id: undefined, productId: undefined, machineId: undefined }, create: pc });
  }
  console.log('Product Cards seeded');

  // Staff Assignments
  const today = new Date();
  today.setHours(0,0,0,0);
  const assignments = [
    { id: 'assign-1', userId: 'user-op-1', machineId: 'mach-1', shift: ShiftType.MORNING, date: today },
    { id: 'assign-2', userId: 'user-op-2', machineId: 'mach-2', shift: ShiftType.MORNING, date: today },
    { id: 'assign-3', userId: 'user-op-3', machineId: 'mach-3', shift: ShiftType.MORNING, date: today },
    { id: 'assign-4', userId: 'user-op-4', machineId: 'mach-4', shift: ShiftType.MORNING, date: today },
    { id: 'assign-5', userId: 'user-op-5', machineId: 'mach-5', shift: ShiftType.AFTERNOON, date: today },
    { id: 'assign-6', userId: 'user-op-6', machineId: 'mach-7', shift: ShiftType.AFTERNOON, date: today },
    { id: 'assign-7', userId: 'user-op-7', machineId: 'mach-8', shift: ShiftType.AFTERNOON, date: today },
    { id: 'assign-8', userId: 'user-op-8', machineId: 'mach-10', shift: ShiftType.AFTERNOON, date: today },
  ];

  for (const a of assignments) {
    await prisma.staffAssignment.upsert({ where: { id: a.id }, update: { shift: a.shift, date: a.date, isActive: true }, create: a });
  }
  console.log('Assignments seeded');

  // Alerts
  const alerts = [
    { id: 'alert-1', machineId: 'mach-3', title: 'Machine Stopped - IARO-70', message: 'Film feed mechanism jammed. Operator reported unusual noise before stoppage.', severity: AlertSeverity.CRITICAL, status: AlertStatus.ACTIVE, escalationLevel: 2, whatsappSent: true },
    { id: 'alert-2', machineId: 'mach-6', title: 'Scheduled Maintenance - Eurotap', message: 'Quarterly maintenance in progress. Expected completion: 14:00.', severity: AlertSeverity.WARNING, status: AlertStatus.ACKNOWLEDGED, escalationLevel: 0 },
    { id: 'alert-3', machineId: 'mach-1', title: 'Glue Temperature Warning', message: 'Glue temperature approaching upper limit (172°C). Recommended: 165°C.', severity: AlertSeverity.WARNING, status: AlertStatus.ACTIVE, escalationLevel: 1 },
    { id: 'alert-4', machineId: 'mach-7', title: 'Production Target Reached 75%', message: 'Killian 1 has reached 75% of daily production target.', severity: AlertSeverity.INFO, status: AlertStatus.ACTIVE, escalationLevel: 0 },
    { id: 'alert-5', machineId: 'mach-2', title: 'Low Ink Level - Hitachi Printer', message: 'Ink level at 15%. Replace cartridge within next 2 hours.', severity: AlertSeverity.WARNING, status: AlertStatus.ACTIVE, escalationLevel: 1, whatsappSent: true },
    { id: 'alert-6', machineId: 'mach-4', title: 'Daily Target Achieved', message: 'ISHIDA 1 exceeded daily target. Currently at 105%.', severity: AlertSeverity.INFO, status: AlertStatus.RESOLVED },
  ];

  for (const a of alerts) {
    await prisma.alert.upsert({ where: { id: a.id }, update: { title: a.title, message: a.message, severity: a.severity, status: a.status, escalationLevel: a.escalationLevel }, create: a });
  }
  console.log('Alerts seeded');

  // Incidents
  const incidents = [
    { id: 'inc-1', machineId: 'mach-3', reportedById: 'user-op-3', title: 'Film feed jam', description: 'Vertical packaging film got stuck in the feed mechanism causing production halt.', priority: IncidentPriority.HIGH, status: IncidentStatus.OPEN, category: 'Mechanical', downtimeMinutes: 45 },
    { id: 'inc-2', machineId: 'mach-6', reportedById: 'user-leader-1', title: 'Tableting die wear', description: 'Visible wear on tableting dies. Replacement needed during scheduled maintenance.', priority: IncidentPriority.MEDIUM, status: IncidentStatus.IN_PROGRESS, category: 'Wear & Tear', downtimeMinutes: 120 },
    { id: 'inc-3', machineId: 'mach-1', reportedById: 'user-op-1', resolvedById: 'user-leader-1', title: 'Glue nozzle clog', description: 'Glue nozzle on Betti 1 was partially clogged causing intermittent sealing issues.', priority: IncidentPriority.MEDIUM, status: IncidentStatus.RESOLVED, category: 'Glue System', downtimeMinutes: 15, resolution: 'Cleaned nozzle with heated solvent. Replaced O-ring seal.', resolvedAt: new Date() },
    { id: 'inc-4', machineId: 'mach-8', reportedById: 'user-op-7', title: 'Abnormal vibration', description: 'Unusual vibration detected during high-speed operation on Killian 2.', priority: IncidentPriority.HIGH, status: IncidentStatus.ESCALATED, category: 'Mechanical', downtimeMinutes: 0 },
    { id: 'inc-5', machineId: 'mach-2', reportedById: 'user-op-2', resolvedById: 'user-op-2', title: 'Printer alignment issue', description: 'Date code printing was misaligned on Marseille Soap packaging.', priority: IncidentPriority.LOW, status: IncidentStatus.RESOLVED, category: 'Printer', downtimeMinutes: 10, resolution: 'Recalibrated print head position. Test prints confirmed alignment.', resolvedAt: new Date() },
  ];

  for (const inc of incidents) {
    await prisma.incident.upsert({ where: { id: inc.id }, update: { title: inc.title, status: inc.status, priority: inc.priority }, create: inc });
  }
  console.log('Incidents seeded');

  // Pallets
  const pallets = [
    { id: 'pal-1', palletNumber: 'PAL-2026-0501', machineId: 'mach-1', productId: 'prod-1', status: PalletStatus.IN_PROGRESS, targetQuantity: 48, currentQuantity: 35, shift: ShiftType.MORNING, line: 'Line 1', location: 'Hall A - Bay 3' },
    { id: 'pal-2', palletNumber: 'PAL-2026-0502', machineId: 'mach-2', productId: 'prod-2', status: PalletStatus.COMPLETED, targetQuantity: 60, currentQuantity: 60, shift: ShiftType.MORNING, line: 'Line 2', location: 'Staging Area B', completedAt: new Date() },
    { id: 'pal-3', palletNumber: 'PAL-2026-0503', machineId: 'mach-4', productId: 'prod-4', status: PalletStatus.IN_PROGRESS, targetQuantity: 72, currentQuantity: 54, shift: ShiftType.MORNING, line: 'Line 1', location: 'Hall B - Bay 1' },
    { id: 'pal-4', palletNumber: 'PAL-2026-0504', machineId: 'mach-7', productId: 'prod-6', status: PalletStatus.DISPATCHED, targetQuantity: 40, currentQuantity: 40, shift: ShiftType.MORNING, line: 'Line 2', location: 'Dispatch Dock', completedAt: new Date() },
    { id: 'pal-5', palletNumber: 'PAL-2026-0505', machineId: 'mach-5', productId: 'prod-5', status: PalletStatus.IN_PROGRESS, targetQuantity: 36, currentQuantity: 22, shift: ShiftType.AFTERNOON, line: 'Line 2', location: 'Hall B - Bay 4' },
    { id: 'pal-6', palletNumber: 'PAL-2026-0506', machineId: 'mach-8', productId: 'prod-7', status: PalletStatus.COMPLETED, targetQuantity: 56, currentQuantity: 56, shift: ShiftType.AFTERNOON, line: 'Line 3', location: 'Staging Area C', completedAt: new Date() },
  ];

  for (const p of pallets) {
    await prisma.pallet.upsert({ where: { palletNumber: p.palletNumber }, update: { status: p.status, currentQuantity: p.currentQuantity }, create: p });
  }
  console.log('Pallets seeded');

  // Waste entries
  const wasteEntries = [
    { id: 'waste-1', machineId: 'mach-1', userId: 'user-op-1', category: 'Material', quantity: 2.3, reason: 'Film tear during changeover', shift: ShiftType.MORNING },
    { id: 'waste-2', machineId: 'mach-2', userId: 'user-op-2', category: 'Product', quantity: 1.5, reason: 'Misaligned labels - batch rejected', shift: ShiftType.MORNING },
    { id: 'waste-3', machineId: 'mach-3', userId: 'user-op-3', category: 'Packaging', quantity: 3.8, reason: 'Damaged pouches from jam', shift: ShiftType.MORNING },
    { id: 'waste-4', machineId: 'mach-4', userId: 'user-op-4', category: 'Material', quantity: 0.8, reason: 'Overfill during calibration', shift: ShiftType.MORNING },
    { id: 'waste-5', machineId: 'mach-7', userId: 'user-op-6', category: 'Product', quantity: 1.2, reason: 'Cracked tablets during pressing', shift: ShiftType.AFTERNOON },
    { id: 'waste-6', machineId: 'mach-8', userId: 'user-op-7', category: 'Packaging', quantity: 0.5, reason: 'Box printing error', shift: ShiftType.AFTERNOON },
  ];

  for (const w of wasteEntries) {
    await prisma.wasteEntry.upsert({ where: { id: w.id }, update: { quantity: w.quantity }, create: w });
  }
  console.log('Waste entries seeded');

  // Printer Configs
  const printerConfigs = [
    { id: 'prt-1', machineId: 'mach-1', productName: 'OXO Dishwasher Tabs 40pc', dateFormat: 'DD/MM/YYYY', printPosition: 'Right side, 15mm from edge', printSpeed: 2.0, inkType: 'Hitachi JP-K72', status: 'OK' },
    { id: 'prt-2', machineId: 'mach-2', productName: 'Marseille Soap 200g', dateFormat: 'MM/YYYY', printPosition: 'Bottom center', printSpeed: 1.8, inkType: 'Hitachi JP-K72', status: 'OK' },
    { id: 'prt-3', machineId: 'mach-4', productName: 'Toilet Tablets 8pc', dateFormat: 'DD/MM/YYYY', printPosition: 'Top flap, 10mm from fold', printSpeed: 2.5, inkType: 'Hitachi JP-K67', status: 'OK' },
    { id: 'prt-4', machineId: 'mach-7', productName: 'WC Block Lemon 50g', dateFormat: 'MM/YYYY', printPosition: 'Back panel center', printSpeed: 3.0, inkType: 'Hitachi JP-K72', status: 'Low Ink' },
    { id: 'prt-5', machineId: 'mach-8', productName: 'Dishwasher Salt Tabs', dateFormat: 'DD/MM/YYYY', printPosition: 'Side panel, 20mm from bottom', printSpeed: 2.2, inkType: 'Hitachi JP-K67', status: 'OK' },
  ];

  for (const pc of printerConfigs) {
    await prisma.printerConfig.upsert({ where: { id: pc.id }, update: { status: pc.status, printSpeed: pc.printSpeed }, create: pc });
  }
  console.log('Printer configs seeded');

  // Production Logs (last 7 days)
  const machineIds = machines.map(m => m.id);
  const shifts: ShiftType[] = [ShiftType.MORNING, ShiftType.AFTERNOON, ShiftType.NIGHT];
  
  for (let d = 6; d >= 0; d--) {
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - d);
    logDate.setHours(0,0,0,0);
    
    for (const mid of machineIds) {
      for (const shift of shifts) {
        const baseTarget = 400 + Math.floor(Math.abs(hashCode(mid + d.toString())) % 200);
        const variance = 0.65 + (Math.abs(hashCode(mid + shift + d.toString())) % 35) / 100;
        const produced = Math.floor(baseTarget * variance);
        const downtime = Math.floor(Math.abs(hashCode(mid + shift + d.toString() + 'dt')) % 60);
        const oee = Math.min(95, Math.max(55, (produced / baseTarget) * 100 - downtime / 10));
        const logId = `plog-${mid}-${d}-${shift}`;

        await prisma.productionLog.upsert({
          where: { id: logId },
          update: { produced, target: baseTarget, downtime, oee },
          create: { id: logId, machineId: mid, shift, date: logDate, produced, target: baseTarget, downtime, oee }
        });
      }
    }
  }
  console.log('Production logs seeded');

  // Maintenance Reports
  const maintenanceReports = [
    { id: 'maint-1', machineId: 'mach-3', mechanicId: 'user-mech-1', type: MaintenanceType.REPAIR, title: 'Film feed mechanism repair', description: 'Replaced broken feed rollers and realigned film path. Tension spring was worn out.', partsChanged: 'Feed rollers (x2), Tension spring', timeSpentMin: 90, laborCost: 150, partsCost: 280, status: 'COMPLETED' },
    { id: 'maint-2', machineId: 'mach-6', mechanicId: 'user-mech-2', type: MaintenanceType.PREVENTIVE, title: 'Quarterly maintenance - Eurotap', description: 'Full inspection of tableting dies, lubrication of moving parts, calibration check.', partsChanged: 'Lubricant, Filter cartridge', timeSpentMin: 180, laborCost: 300, partsCost: 85, status: 'IN_PROGRESS' },
    { id: 'maint-3', machineId: 'mach-1', mechanicId: 'user-mech-3', type: MaintenanceType.PART_CHANGE, title: 'Glue nozzle replacement', description: 'Replaced clogged glue nozzle with new one. Cleaned glue system pipes.', partsChanged: 'Glue nozzle Type A (x1), O-ring seal (x2)', timeSpentMin: 35, laborCost: 60, partsCost: 120, status: 'COMPLETED' },
    { id: 'maint-4', machineId: 'mach-8', mechanicId: 'user-mech-4', type: MaintenanceType.INSPECTION, title: 'Vibration diagnostic - Killian 2', description: 'Investigated abnormal vibration during high-speed operation. Found loose bearing mount.', partsChanged: null, timeSpentMin: 60, laborCost: 100, partsCost: 0, status: 'COMPLETED' },
    { id: 'maint-5', machineId: 'mach-2', mechanicId: 'user-mech-1', type: MaintenanceType.REPAIR, title: 'Printer head realignment', description: 'Hitachi printer head was misaligned. Recalibrated and tested with sample prints.', partsChanged: 'Calibration kit', timeSpentMin: 25, laborCost: 40, partsCost: 15, status: 'COMPLETED' },
    { id: 'maint-6', machineId: 'mach-7', mechanicId: 'user-mech-5', type: MaintenanceType.EMERGENCY, title: 'Emergency bearing replacement', description: 'Main bearing failed during operation. Emergency replacement to minimize downtime.', partsChanged: 'Main bearing SKF-6205 (x1)', timeSpentMin: 120, laborCost: 200, partsCost: 350, status: 'COMPLETED' },
  ];

  for (const mr of maintenanceReports) {
    await prisma.maintenanceReport.upsert({ where: { id: mr.id }, update: { title: mr.title, status: mr.status }, create: mr });
  }
  console.log('Maintenance reports seeded');

  // Processes
  const processes = [
    { id: 'proc-1', name: 'Tablet Pressing', description: 'High-pressure compression of powder into tablet form', category: 'Manufacturing', steps: '1. Powder mixing\n2. Granulation\n3. Compression\n4. Quality check' },
    { id: 'proc-2', name: 'Flow Wrapping', description: 'Horizontal packaging of individual items in sealed film', category: 'Packaging', steps: '1. Product feeding\n2. Film unwinding\n3. Sealing\n4. Cutting' },
    { id: 'proc-3', name: 'Vertical Form Fill Seal', description: 'Vertical packaging for powders and granules', category: 'Packaging', steps: '1. Film forming\n2. Product dosing\n3. Sealing\n4. Cutting' },
    { id: 'proc-4', name: 'Weight Dosing', description: 'Precision weight-based dosing system', category: 'Dosing', steps: '1. Product loading\n2. Weight measurement\n3. Dispensing\n4. Verification' },
    { id: 'proc-5', name: 'Cartoning', description: 'Secondary packaging into cardboard boxes', category: 'Packaging', steps: '1. Box forming\n2. Product insertion\n3. Flap closing\n4. Gluing' },
    { id: 'proc-6', name: 'Palletizing', description: 'Stacking finished products on pallets', category: 'Logistics', steps: '1. Product sorting\n2. Layer formation\n3. Stacking\n4. Wrapping' },
  ];

  for (const p of processes) {
    await prisma.process.upsert({ where: { name: p.name }, update: { description: p.description, category: p.category }, create: p });
  }
  console.log('Processes seeded');

  // Agencies 🆕
  const agencies = [
    { id: "agency-1", name: "WorkForce Polska", contactName: "Marek Nowicki", contactEmail: "marek@workforce.pl", contactPhone: "+48 601 000 111", address: "ul. Przemyslowa 15, Zielona Gora", notes: "Preferred agency for operators" },
    { id: "agency-2", name: "Tempo Sp. z o.o.", contactName: "Anna Lewandowska", contactEmail: "anna@tempo.pl", contactPhone: "+48 602 000 222", address: "ul. Fabryczna 8, Zielona Gora", notes: "Temporary staffing specialist" },
  ];
  for (const a of agencies) {
    await prisma.agency.upsert({ where: { id: a.id }, update: { name: a.name, contactName: a.contactName }, create: a });
  }
  console.log("Agencies seeded");

  // Staff Ratings 🆕
  const ratings = [
    { id: "rating-1", userId: "user-op-1", score: 4, strengths: "Fast changeover, good quality control", notes: "Exceeded daily target consistently" },
    { id: "rating-2", userId: "user-op-1", score: 5, strengths: "Team player, helps others", notes: "Trained new operator this week" },
    { id: "rating-3", userId: "user-op-2", score: 3, strengths: "Good attendance", notes: "Needs improvement on machine setup speed" },
    { id: "rating-4", userId: "user-op-3", score: 5, strengths: "Excellent troubleshooting", notes: "Detected and resolved jam quickly" },
    { id: "rating-5", userId: "user-op-4", score: 4, strengths: "High precision, low waste", notes: "Consistently good performance" },
    { id: "rating-6", userId: "user-mech-1", score: 5, strengths: "Quick diagnostics, efficient repairs", notes: "Reduced average repair time by 20%" },
  ];
  for (const r of ratings) {
    await prisma.staffRating.upsert({ where: { id: r.id }, update: { score: r.score, strengths: r.strengths, notes: r.notes }, create: r });
  }
  console.log("Staff ratings seeded");

  // Staff Incidents 🆕
  const staffIncidents = [
    { id: "sinc-1", userId: "user-op-3", title: "Late arrival without notice", description: "Arrived 45 minutes late. Did not call to inform.", severity: "LOW", resolved: true, resolution: "Verbal warning issued. Employee apologized.", resolvedAt: new Date() },
    { id: "sinc-2", userId: "user-op-7", title: "Safety glasses not worn", description: "Found working without safety glasses on the production floor.", severity: "MEDIUM", resolved: true, resolution: "Written warning. Safety refresher training scheduled.", resolvedAt: new Date() },
    { id: "sinc-3", userId: "user-op-1", title: "Quality check missed", description: "Failed to perform quality check after changeover. 2 pallets had to be rechecked.", severity: "HIGH", resolved: true, resolution: "Process reminder. Additional training on changeover procedure.", resolvedAt: new Date() },
    { id: "sinc-4", userId: "user-op-5", title: "Unauthorized cell phone use", description: "Using personal phone during production time near running machinery.", severity: "MEDIUM", resolved: false },
  ];
  for (const si of staffIncidents) {
    await prisma.staffIncident.upsert({ where: { id: si.id }, update: { resolved: si.resolved, resolution: si.resolution }, create: si });
  }
  console.log("Staff incidents seeded");

  console.log("Seed complete!");


  console.log('Seed complete!');
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
