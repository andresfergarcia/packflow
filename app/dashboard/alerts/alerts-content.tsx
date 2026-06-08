'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Bell, AlertTriangle, Info, CheckCircle, MessageCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

const SEVERITY_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  CRITICAL: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  WARNING: { icon: Bell, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  INFO: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
};

export function AlertsContent() {
  const { data: alerts, loading, refetch } = useFetch<any[]>('/api/alerts', []);
  const [filter, setFilter] = useState('ALL');
  const { t } = useI18n();

  const filtered = filter === 'ALL' ? alerts : alerts?.filter?.((a: any) => a?.status === filter) ?? [];

  const handleAction = async (id: string, status: string) => {
    try {
      await fetch('/api/alerts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      toast.success(`Alert ${status.toLowerCase()}`);
      refetch();
    } catch { toast.error('Failed to update alert'); }
  };

  const simulateWhatsApp = (alert: any) => {
    toast.success(t('alerts.whatsappSent') + `: ${alert?.title ?? 'Alert'}`, { description: t('alerts.whatsappDesc'), duration: 5000 });
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>;

  const filterLabels: Record<string, string> = { ALL: t('common.all'), ACTIVE: t('alerts.active'), ACKNOWLEDGED: t('alerts.acknowledged'), RESOLVED: t('alerts.resolved') };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
            <Bell className="h-6 w-6 text-[#005A9E]" />{t('alerts.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('alerts.desc')}</p>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((f: string) => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className={filter === f ? 'bg-[#005A9E] hover:bg-[#004B87]' : ''}>
              {filterLabels[f] ?? f}
              {f !== 'ALL' && <Badge variant="secondary" className="ml-1.5 text-[10px]">{alerts?.filter?.((a: any) => a?.status === f)?.length ?? 0}</Badge>}
            </Button>
          ))}
        </div>
      </FadeIn>

      <Stagger staggerDelay={0.04}>
        <div className="space-y-3">
          {(filtered?.length ?? 0) === 0 ? (
            <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center text-muted-foreground">{t('alerts.noAlerts')}</CardContent></Card>
          ) : filtered?.map?.((alert: any) => {
            const sev = SEVERITY_CONFIG[alert?.severity] ?? SEVERITY_CONFIG.INFO;
            const SevIcon = sev?.icon ?? Info;
            return (
              <StaggerItem key={alert?.id}>
                <Card className={`border-0 shadow-sm ${alert?.status === 'ACTIVE' ? 'border-l-4 border-l-' + (alert?.severity === 'CRITICAL' ? 'red-500' : alert?.severity === 'WARNING' ? 'amber-500' : 'blue-500') : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-lg ${sev.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <SevIcon className={`h-4 w-4 ${sev.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold">{alert?.title ?? 'Alert'}</h3>
                          <Badge variant={alert?.severity === 'CRITICAL' ? 'destructive' : 'outline'} className="text-[10px]">{alert?.severity ?? 'INFO'}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{alert?.status ?? 'UNKNOWN'}</Badge>
                          {alert?.whatsappSent && <Badge variant="outline" className="text-[10px] text-green-600 border-green-300"><MessageCircle className="h-3 w-3 mr-1" />WhatsApp</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{alert?.message ?? ''}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                          <span className="font-medium">{alert?.machine?.name ?? 'N/A'}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(alert?.createdAt ?? Date.now()).toLocaleString()}</span>
                          {alert?.escalationLevel > 0 && <span>{t('alerts.escalationLevel')}: {alert.escalationLevel}</span>}
                        </div>
                      </div>
                      {alert?.status === 'ACTIVE' && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleAction(alert.id, 'ACKNOWLEDGED')}>
                            <CheckCircle className="h-3 w-3 mr-1" />{t('alerts.acknowledge')}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs" onClick={() => simulateWhatsApp(alert)}>
                            <MessageCircle className="h-3 w-3 mr-1" />{t('alerts.escalate')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          }) ?? null}
        </div>
      </Stagger>
    </div>
  );
}
