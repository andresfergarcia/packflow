'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  LayoutDashboard, Boxes, Bell, Package, AlertTriangle,
  Bot, Printer, Users, Eye, Trash2, BarChart3, FileText, TrendingUp,
  Menu, X, LogOut, Factory, Wrench, ClipboardList, PlusCircle, Settings2, Cog
} from 'lucide-react';

const NAV_ITEMS: Record<string, Array<{ href: string; labelKey: string; icon: any }>> = {
  OPERATOR: [
    { href: '/dashboard', labelKey: 'nav.machineDashboard', icon: LayoutDashboard },
    { href: '/dashboard/products', labelKey: 'nav.productCards', icon: Boxes },
    { href: '/dashboard/machine-config', labelKey: 'nav.machineConfig', icon: Settings2 },
    { href: '/dashboard/alerts', labelKey: 'nav.alerts', icon: Bell },
    { href: '/dashboard/pallets', labelKey: 'nav.palletTracking', icon: Package },
    { href: '/dashboard/incidents', labelKey: 'nav.incidents', icon: AlertTriangle },
    { href: '/dashboard/ai-assistant', labelKey: 'nav.aiAssistant', icon: Bot },
    { href: '/dashboard/printer', labelKey: 'nav.hitachiPrinter', icon: Printer },
    { href: '/dashboard/add-machine', labelKey: 'nav.addMachine', icon: PlusCircle },
  ],
  TEAM_LEADER: [
    { href: '/dashboard', labelKey: 'nav.supervision', icon: Eye },
    { href: '/dashboard/staff', labelKey: 'nav.staffManagement', icon: Users },
    { href: '/dashboard/add-product', labelKey: 'nav.addProduct', icon: PlusCircle },
    { href: '/dashboard/incidents', labelKey: 'nav.incidents', icon: AlertTriangle },
    { href: '/dashboard/waste', labelKey: 'nav.wasteControl', icon: Trash2 },
    { href: '/dashboard/pallets', labelKey: 'nav.palletTracking', icon: Package },
    { href: '/dashboard/alerts', labelKey: 'nav.alerts', icon: Bell },
    { href: '/dashboard/products', labelKey: 'nav.productCards', icon: Boxes },
  ],
  PLANT_DIRECTOR: [
    { href: '/dashboard', labelKey: 'nav.plantOverview', icon: Factory },
    { href: '/dashboard/kpis', labelKey: 'nav.kpis', icon: BarChart3 },
    { href: '/dashboard/reports', labelKey: 'nav.reports', icon: FileText },
    { href: '/dashboard/analytics', labelKey: 'nav.analytics', icon: TrendingUp },
    { href: '/dashboard/processes', labelKey: 'nav.processes', icon: Cog },
    { href: '/dashboard/incidents', labelKey: 'nav.incidents', icon: AlertTriangle },
    { href: '/dashboard/staff', labelKey: 'nav.staff', icon: Users },
    { href: '/dashboard/alerts', labelKey: 'nav.alerts', icon: Bell },
  ],
  MECHANIC: [
    { href: '/dashboard', labelKey: 'nav.machineDashboard', icon: LayoutDashboard },
    { href: '/dashboard/maintenance', labelKey: 'nav.maintenance', icon: Wrench },
    { href: '/dashboard/incidents', labelKey: 'nav.incidents', icon: AlertTriangle },
    { href: '/dashboard/alerts', labelKey: 'nav.alerts', icon: Bell },
    { href: '/dashboard/add-machine', labelKey: 'nav.addMachine', icon: PlusCircle },
    { href: '/dashboard/ai-assistant', labelKey: 'nav.aiAssistant', icon: Bot },
  ],
};

const ROLE_LABEL_KEYS: Record<string, string> = {
  OPERATOR: 'role.operator',
  TEAM_LEADER: 'role.teamLeader',
  PLANT_DIRECTOR: 'role.plantDirector',
  MECHANIC: 'role.mechanic',
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();

  const role = (session?.user as any)?.role || 'OPERATOR';
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.OPERATOR;
  const userName = session?.user?.name ?? 'User';

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#004B87] dark:bg-[#003360] text-white transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-4 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <Image src="/MARBA.png" alt="Marba" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight leading-none">MARBA</h1>
                <p className="text-[10px] text-white/60 leading-tight mt-0.5">PackFlow v2.0</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 lg:hidden text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Company Address Bar */}
          <div className="px-4 py-2 bg-white/5 border-b border-white/10">
            <p className="text-[10px] text-white/50 truncate">{t('app.company')}</p>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-3">
            <nav className="px-3 space-y-0.5">
              {navItems?.map((item: any) => {
                const Icon = item?.icon;
                const isActive = pathname === item?.href || (item?.href !== '/dashboard' && pathname?.startsWith?.(item?.href));
                return (
                  <Link
                    key={item?.href}
                    href={item?.href ?? '/dashboard'}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <span>{t(item?.labelKey) ?? ''}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">{userName?.charAt?.(0) ?? 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <span className="text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded">{t(ROLE_LABEL_KEYS[role]) ?? role}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector compact />
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="flex-1 justify-start text-white/70 hover:text-white hover:bg-white/10" onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut className="h-4 w-4 mr-2" />{t('common.signOut')}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-[#005A9E] to-[#0078D4] text-white shadow-md">
          <div className="flex items-center justify-between h-12 px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/80 hover:text-white">
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <Factory className="h-4 w-4 text-white/80" />
                <h2 className="font-display text-sm font-semibold tracking-wide">
                  {navItems?.find?.((i: any) => i?.href === pathname)?.labelKey ? t(navItems.find((i: any) => i?.href === pathname)?.labelKey ?? '') : 'Dashboard'}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Badge variant="outline" className="font-mono text-xs text-white/90 border-white/30 bg-white/10">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
