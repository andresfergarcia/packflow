'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Clock, User, CheckCircle, AlertCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

const STATUS_CFG: Record<string, { color: string; bg: string; icon: any }> = {
  OPEN: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: AlertCircle },
  IN_PROGRESS: { color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  RESOLVED: { color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle },
  ESCALATED: { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: ArrowUpCircle },
};

const PRIORITY_CFG: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  HIGH: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function IncidentsContent() {
  const { data: session } = useSession() || {};
  const { data: incidents, loading, refetch } = useFetch<any[]>('/api/incidents', []);
  const { data: machines } = useFetch<any[]>('/api/machines', []);
  const [filter, setFilter] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ machineId: '', title: '', description: '', priority: 'MEDIUM', category: 'Mechanical' });
  const { t } = useI18n();

  const filtered = filter === 'ALL' ? incidents : incidents?.filter?.((i: any) => i?.status === filter) ?? [];

  const handleCreate = async () => {
    try {
      const userId = (session?.user as any)?.id;
      if (!userId || !form.machineId || !form.title) { toast.error(t('incidents.fillRequired')); return; }
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, reportedById: userId }),
      });
      toast.success(t('incidents.reported'));
      setDialogOpen(false);
      setForm({ machineId: '', title: '', description: '', priority: 'MEDIUM', category: 'Mechanical' });
      refetch();
    } catch { toast.error('Failed to create incident'); }
  };

  const handleResolve = async (id: string) => {
    try {
      await fetch('/api/incidents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'RESOLVED', resolvedById: (session?.user as any)?.id, resolvedAt: new Date().toISOString() }),
      });
      toast.success(t('incidents.resolved'));
      refetch();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>;

  const filterLabels: Record<string, string> = { ALL: t('common.all'), OPEN: t('incidents.open'), IN_PROGRESS: t('incidents.inProgress'), ESCALATED: t('incidents.escalated'), RESOLVED: t('alerts.resolved') };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
              <AlertTriangle className="h-6 w-6 text-[#005A9E]" />{t('incidents.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t('incidents.desc')}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#005A9E] hover:bg-[#004B87]"><Plus className="h-4 w-4 mr-1" />{t('incidents.reportIncident')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('incidents.reportNew')}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>{t('incidents.machineRequired')}</Label>
                  <select value={form.machineId} onChange={(e: any) => setForm(p => ({...p, machineId: e?.target?.value ?? ''}))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                    <option value="">{t('incidents.selectMachine')}</option>
                    {machines?.map?.((m: any) => <option key={m?.id} value={m?.id}>{m?.name ?? 'Machine'}</option>) ?? null}
                  </select>
                </div>
                <div><Label>{t('incidents.titleRequired')}</Label><Input value={form.title} onChange={(e: any) => setForm(p => ({...p, title: e?.target?.value ?? ''}))} placeholder={t('incidents.briefDesc')} className="mt-1" /></div>
                <div><Label>{t('incidents.description')}</Label><textarea value={form.description} onChange={(e: any) => setForm(p => ({...p, description: e?.target?.value ?? ''}))} placeholder={t('incidents.detailedDesc')} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 min-h-[80px]" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t('incidents.priority')}</Label>
                    <select value={form.priority} onChange={(e: any) => setForm(p => ({...p, priority: e?.target?.value ?? 'MEDIUM'}))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p: string) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div><Label>{t('incidents.category')}</Label>
                    <select value={form.category} onChange={(e: any) => setForm(p => ({...p, category: e?.target?.value ?? ''}))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                      {['Mechanical', 'Electrical', 'Glue System', 'Printer', 'Wear & Tear', 'Software', 'Other'].map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center text-xs text-muted-foreground">
                  {t('incidents.photoSimulation')}
                </div>
                <Button onClick={handleCreate} className="w-full bg-[#005A9E] hover:bg-[#004B87]">{t('incidents.submit')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED'].map((f: string) => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className={filter === f ? 'bg-[#005A9E] hover:bg-[#004B87]' : ''}>
              {filterLabels[f] ?? f}
              <Badge variant="secondary" className="ml-1.5 text-[10px]">{f === 'ALL' ? incidents?.length ?? 0 : incidents?.filter?.((i: any) => i?.status === f)?.length ?? 0}</Badge>
            </Button>
          ))}
        </div>
      </FadeIn>

      <Stagger staggerDelay={0.04}>
        <div className="space-y-3">
          {filtered?.map?.((inc: any) => {
            const st = STATUS_CFG[inc?.status] ?? STATUS_CFG.OPEN;
            const StIcon = st?.icon ?? AlertCircle;
            return (
              <StaggerItem key={inc?.id}>
                <Card className="hover:shadow-lg transition-all border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-lg ${st.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <StIcon className={`h-4 w-4 ${st.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold">{inc?.title ?? 'Incident'}</h3>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_CFG[inc?.priority] ?? ''}`}>{inc?.priority ?? 'N/A'}</span>
                          <Badge variant="outline" className={`text-[10px] ${st.color}`}>{inc?.status?.replace?.('_', ' ') ?? 'OPEN'}</Badge>
                          {inc?.category && <Badge variant="secondary" className="text-[10px]">{inc.category}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{inc?.description ?? ''}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
                          <span className="font-medium">{inc?.machine?.name ?? 'N/A'}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{inc?.reportedBy?.name ?? 'N/A'}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(inc?.createdAt ?? Date.now()).toLocaleString()}</span>
                          {inc?.downtimeMinutes > 0 && <span>{t('incidents.downtime')}: {inc.downtimeMinutes} min</span>}
                        </div>
                        {inc?.resolution && (
                          <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">{t('incidents.resolution')}:</span> {inc.resolution}
                          </div>
                        )}
                      </div>
                      {inc?.status !== 'RESOLVED' && (
                        <Button size="sm" variant="outline" className="text-xs shrink-0" onClick={() => handleResolve(inc?.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />{t('incidents.resolve')}
                        </Button>
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
