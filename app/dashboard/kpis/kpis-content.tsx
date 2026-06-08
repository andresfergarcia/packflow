'use client';

import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n/i18n-context';

const OEEChart = dynamic(() => import('./oee-chart'), { ssr: false, loading: () => <Skeleton className="h-64 rounded-lg" /> });

export function KPIsContent() {
  const { data: machines, loading } = useFetch<any[]>('/api/machines', []);
  const { data: stats } = useFetch<any>('/api/stats', {});
  const { t } = useI18n();

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>;

  const avgOee = stats?.avgOee ?? 0;
  const runningCount = machines?.filter?.((m: any) => m?.status === 'RUNNING')?.length ?? 0;
  const totalDowntime = machines?.filter?.((m: any) => m?.status === 'STOPPED' || m?.status === 'MAINTENANCE')?.length ?? 0;
  const avgUptime = machines?.length ? machines.reduce((s: number, m: any) => s + (m?.uptime ?? 0), 0) / machines.length : 0;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <BarChart3 className="h-6 w-6 text-[#005A9E]" />{t('kpis.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('kpis.desc')}</p>
      </FadeIn>

      <FadeIn>
        <Card className="bg-gradient-to-br from-[#005A9E]/5 to-[#0078D4]/10 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#005A9E]/10 mb-2">
                  <span className={`text-2xl font-bold font-display ${avgOee >= 80 ? 'text-emerald-600' : avgOee >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{avgOee}%</span>
                </div>
                <p className="text-sm font-medium">{t('kpis.averageOEE')}</p>
                <p className="text-xs text-muted-foreground">{t('common.target')}: 85%</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-2">
                  <span className="text-2xl font-bold font-display text-emerald-600">{avgUptime?.toFixed?.(1) ?? 0}%</span>
                </div>
                <p className="text-sm font-medium">{t('kpis.avgUptime')}</p>
                <p className="text-xs text-muted-foreground">{t('kpis.allMachines')}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                  <span className="text-2xl font-bold font-display text-[#005A9E]">{runningCount}/{machines?.length ?? 0}</span>
                </div>
                <p className="text-sm font-medium">{t('kpis.running')}</p>
                <p className="text-xs text-muted-foreground">{t('kpis.activeNow')}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                  <span className="text-2xl font-bold font-display text-red-600">{totalDowntime}</span>
                </div>
                <p className="text-sm font-medium">{t('kpis.down')}</p>
                <p className="text-xs text-muted-foreground">{t('kpis.stoppedMaintenance')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><TrendingUp className="h-4 w-4 text-[#005A9E]" />{t('kpis.oeeByMachine')}</CardTitle></CardHeader>
        <CardContent className="h-72">
          <OEEChart machines={machines ?? []} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-display font-semibold tracking-tight mb-4 flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <Target className="h-5 w-5 text-[#005A9E]" />{t('kpis.machinePerformance')}
        </h2>
        <Stagger staggerDelay={0.04}>
          <div className="grid gap-3">
            {machines?.map?.((m: any) => {
              const prodPct = (m?.dailyTarget ?? 0) > 0 ? ((m?.dailyProduced ?? 0) / (m?.dailyTarget ?? 1)) * 100 : 0;
              return (
                <StaggerItem key={m?.id}>
                  <Card className="hover:shadow-lg transition-all border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{m?.name ?? 'Machine'}</h3>
                          <Badge variant={m?.status === 'RUNNING' ? 'secondary' : m?.status === 'STOPPED' ? 'destructive' : 'outline'} className="text-[10px]">{m?.status ?? 'IDLE'}</Badge>
                        </div>
                        <span className={`text-lg font-bold font-mono ${(m?.oee ?? 0) >= 80 ? 'text-emerald-600' : (m?.oee ?? 0) >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{m?.oee?.toFixed?.(1) ?? 0}%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">{t('dash.production')}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={prodPct} className="h-2 flex-1" />
                            <span className="font-mono">{prodPct?.toFixed?.(0) ?? 0}%</span>
                          </div>
                        </div>
                        <div><p className="text-muted-foreground">{t('kpis.uptime')}</p><p className="font-medium mt-1">{m?.uptime?.toFixed?.(1) ?? 0}%</p></div>
                        <div><p className="text-muted-foreground">{t('kpis.speed')}</p><p className="font-mono mt-1">{m?.speed ?? 0} u/min</p></div>
                        <div><p className="text-muted-foreground">{t('machine.product')}</p><p className="font-medium mt-1 truncate">{m?.currentProduct ?? 'None'}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            }) ?? null}
          </div>
        </Stagger>
      </div>
    </div>
  );
}
