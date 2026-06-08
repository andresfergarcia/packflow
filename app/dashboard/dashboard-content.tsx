'use client';

import { useSession } from 'next-auth/react';
import { useFetch } from '@/hooks/use-fetch';
import { StatCard } from '@/components/dashboard/stat-card';
import { MachineCard } from '@/components/dashboard/machine-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  Factory, Activity, BarChart3, AlertTriangle, Package, Trash2,
  Bell, Cog
} from 'lucide-react';

export function DashboardContent() {
  const { data: session } = useSession() || {};
  const { t } = useI18n();
  const role = (session?.user as any)?.role || 'OPERATOR';
  const { data: machines, loading: machinesLoading } = useFetch<any[]>('/api/machines', []);
  const { data: stats, loading: statsLoading } = useFetch<any>('/api/stats', {});
  const { data: alerts } = useFetch<any[]>('/api/alerts', []);

  const activeAlerts = alerts?.filter?.((a: any) => a?.status === 'ACTIVE') ?? [];

  if (machinesLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((i: number) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i: number) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-[#004B87] dark:text-blue-300">
              {role === 'PLANT_DIRECTOR' ? t('dash.plantOverview') : role === 'TEAM_LEADER' ? t('dash.supervisionDashboard') : t('dash.machineDashboard')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {role === 'PLANT_DIRECTOR' ? t('dash.plantOverviewDesc') : role === 'TEAM_LEADER' ? t('dash.supervisionDesc') : t('dash.machineDesc')}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <SlideIn from="bottom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title={t('dash.machinesRunning')} value={`${stats?.runningMachines ?? 0}/${stats?.totalMachines ?? 0}`} icon={Factory} color="text-emerald-600" />
          <StatCard title={t('dash.averageOEE')} value={`${stats?.avgOee ?? 0}%`} icon={BarChart3} color="text-[#005A9E]" />
          <StatCard title={t('dash.activeAlerts')} value={stats?.activeAlerts ?? 0} icon={Bell} color={stats?.activeAlerts > 0 ? 'text-red-600' : 'text-emerald-600'} />
          <StatCard title={t('dash.production')} value={stats?.totalProduced ?? 0} subtitle={`${t('common.target')}: ${stats?.totalTarget ?? 0}`} icon={Package} color="text-[#005A9E]" />
        </div>
      </SlideIn>

      {/* Active Alerts Banner */}
      {(activeAlerts?.length ?? 0) > 0 && (
        <FadeIn>
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">{t('dash.activeAlerts')} ({activeAlerts?.length ?? 0})</h3>
              </div>
              <div className="space-y-1.5">
                {activeAlerts?.slice?.(0, 3)?.map?.((alert: any) => (
                  <div key={alert?.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert?.severity === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-[10px]">{alert?.severity ?? 'INFO'}</Badge>
                      <span className="font-medium">{alert?.machine?.name ?? 'N/A'}</span>
                      <span className="text-muted-foreground">{alert?.title ?? ''}</span>
                    </div>
                  </div>
                )) ?? null}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Machines Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Cog className="h-5 w-5 text-[#005A9E]" />
          <h2 className="text-lg font-display font-semibold tracking-tight text-[#004B87] dark:text-blue-300">{t('dash.machines')}</h2>
          <Badge variant="secondary" className="text-xs">{machines?.length ?? 0} {t('common.total')}</Badge>
        </div>
        <Stagger staggerDelay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {machines?.map?.((machine: any) => (
              <StaggerItem key={machine?.id}>
                <MachineCard machine={machine} compact={role === 'OPERATOR'} />
              </StaggerItem>
            )) ?? null}
          </div>
        </Stagger>
      </div>

      {/* Additional stats for Director */}
      {role === 'PLANT_DIRECTOR' && (
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title={t('dash.openIncidents')} value={stats?.openIncidents ?? 0} icon={AlertTriangle} color="text-amber-600" />
            <StatCard title={t('dash.completedPallets')} value={stats?.completedPallets ?? 0} icon={Package} color="text-emerald-600" />
            <StatCard title={t('dash.inProgress')} value={stats?.inProgressPallets ?? 0} icon={Activity} color="text-[#005A9E]" />
            <StatCard title={t('dash.totalWaste')} value={`${stats?.totalWaste ?? 0} kg`} icon={Trash2} color="text-red-600" />
          </div>
        </FadeIn>
      )}

      {role === 'TEAM_LEADER' && (
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard title={t('dash.openIncidents')} value={stats?.openIncidents ?? 0} icon={AlertTriangle} color="text-amber-600" />
            <StatCard title={t('dash.totalWaste')} value={`${stats?.totalWaste ?? 0} kg`} icon={Trash2} color="text-red-600" />
            <StatCard title={t('dash.palletsToday')} value={(stats?.completedPallets ?? 0) + (stats?.inProgressPallets ?? 0)} icon={Package} color="text-[#005A9E]" />
          </div>
        </FadeIn>
      )}
    </div>
  );
}
